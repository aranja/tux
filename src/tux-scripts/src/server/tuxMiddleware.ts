import express from 'express'
import { join } from 'path'
import { createElement } from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs'
import DefaultDocument from 'react-document'

export interface Options {
  buildPath: string
}

const tuxMiddleware = (options: Options): express.RequestHandler => {
  const appModule = require(join(options.buildPath, 'ssr/app.js'))
  const app = appModule.__esModule ? appModule.default : appModule
  const assets = require(join(options.buildPath, 'static/assets.json'))

  const documentPath = join(options.buildPath, 'ssr/document.js')
  let Document: any = DefaultDocument
  if (fs.existsSync(documentPath)) {
    Document = require(documentPath)
    if (Document.__esModule) {
      Document = Document.default
    }
  }

  return async (req, res, next) => {
    const session = app.createSession()

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
      res.status(session.status || 200)
      res.send('<!doctype html>' + ReactDOMServer.renderToStaticMarkup(html))
    } catch (error) {
      next(error)
    }
  }
}

export default tuxMiddleware
