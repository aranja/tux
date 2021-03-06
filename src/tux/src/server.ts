import express from 'express'
import { ReactChain, Session } from 'react-chain'
import sortChunks from 'webpack-sort-chunks'
import { createElement, ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'
import { DocumentSession } from './DocumentMiddleware'

export { ReactChain }

// Some chunks may contain content hash in their names, for ex. 'main.css?1e7cac4e4d8b52fd5ccd2541146ef03f'.
// We must proper handle such cases, so we use regexp testing here
const cssExtension = /\.css($|\?)/gi

const filter = (chunk: any) => {
  const chunkName = chunk.names[0]
  // This chunk doesn't have a name. This script can't handled it.
  if (chunkName === undefined) {
    return false
  }
  // Skip if the chunk should be lazy loaded
  if (typeof chunk.isInitial === 'function') {
    if (!chunk.isInitial()) {
      return false
    }
  } else if (!chunk.initial) {
    return false
  }
  // Add otherwise
  return true
}

export interface WebpackChunk {
  names: string[]
  files: string[]
  size: number
  hash: string
}

export interface WebpackStats {
  chunks: WebpackChunk[]
  hash: string
  publicPath: string
}

export interface Assets {
  publicPath: string
  js: string[]
  css: string[]
  chunks: {
    [name: string]: {
      entry: string
      size: number
      hash: string
    }
  }
}

export const buildAssets = ({ chunks, publicPath }: WebpackStats): Assets => {
  const assets: Assets = { publicPath, chunks: {}, js: [], css: [] }
  const createAbsolutePath = (file: string) => publicPath + file
  const onlyCssFiles = (file: string) => cssExtension.test(file)

  sortChunks(chunks.filter(filter)).forEach(chunk => {
    const chunkName = chunk.names[0]
    const chunkFiles = chunk.files.map(createAbsolutePath)

    // Webpack outputs an array for each chunk when using sourcemaps
    // But we need only the entry file
    const entry = chunkFiles[0] as string

    assets.js.push(entry)
    assets.chunks[chunkName] = { entry, size: chunk.size, hash: chunk.hash }

    // Gather all css files
    assets.css = assets.css.concat(chunkFiles.filter(onlyCssFiles))
  })

  return assets
}

export interface Options {
  app: ReactChain
  assets: any
  Document: any
}

export type TuxServerSession = Session &
  DocumentSession & {
    req: express.Request
    res: express.Response
    status?: number
  }

export const serve = ({
  app,
  assets,
  Document,
}: Options): express.RequestHandler => {
  return async (req, res, next) => {
    const session = app.createSession() as TuxServerSession

    session.req = req
    session.res = res

    try {
      const body = await app.renderServer(
        session,
        ReactDOMServer.renderToString
      )

      // render middlewares might respond early, eg redirects.
      if (!res.headersSent) {
        const html = createElement(
          Document,
          {
            ...session.document,
            css: assets.css,
            js: assets.js,
          },
          body
        )

        res.send('<!doctype html>' + ReactDOMServer.renderToStaticMarkup(html))
      }
    } catch (error) {
      next(error)
    }
  }
}
