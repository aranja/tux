import createReactChain, { ReactChain, Session } from 'react-chain'
import { hydrate } from 'react-dom'
import express from 'express'
import DocumentMiddleware, { DocumentSession } from './DocumentMiddleware'
import { join } from 'path'
import { createElement, ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs'
import DefaultDocument from 'react-document'
import sortChunks from 'webpack-sort-chunks'

export { DocumentSession }

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

export const buildAssets = ({
  hash,
  chunks,
  publicPath,
}: WebpackStats): Assets => {
  const assets: Assets = { publicPath, chunks: {}, js: [], css: [] }
  const createAbsolutePath = (file: string) => join(publicPath, file)
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

export type TuxBrowserSession = Session &
  DocumentSession & {
    refresh: (onComplete?: (element: Element) => void) => Promise<any>
  }

export type TuxServeeSession = Session &
  DocumentSession & {
    req: express.Request
    res: express.Response
    status?: number
  }

export const createApp = () => {
  const app = createReactChain()
  app.use(DocumentMiddleware)
  return app
}

export const start = (
  app: ReactChain,
  container = document.getElementById('app')
) => {
  const session = app.createSession() as TuxBrowserSession

  session.refresh = async onComplete =>
    await app.renderBrowser(session, element => {
      // ts: element argument doesn't match correctly.
      ;(hydrate as any)(element, container, onComplete)
    })

  session.refresh()
}

export const serve = ({
  app,
  assets,
  Document,
}: Options): express.RequestHandler => {
  return async (req, res, next) => {
    const session = app.createSession() as TuxServeeSession

    session.req = req
    session.res = res

    try {
      const body = await app.renderServer(
        session,
        ReactDOMServer.renderToString
      )
      const html = createElement(
        Document,
        {
          ...session,
          css: assets.css,
          js: assets.js,
        },
        body
      )

      res.send('<!doctype html>' + ReactDOMServer.renderToStaticMarkup(html))
    } catch (error) {
      next(error)
    }
  }
}
