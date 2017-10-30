import createReactChain, { ReactChain, Session } from 'react-chain'
import { render } from 'react-dom'
import express from 'express'
import DocumentMiddleware, { DocumentSession } from './DocumentMiddleware'
import { join } from 'path'
import { createElement } from 'react'
import ReactDOMServer from 'react-dom/server'
import fs from 'fs'
import DefaultDocument from 'react-document'

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
      render(element, container, onComplete)
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
      res.status(session.status || 200)
      res.send('<!doctype html>' + ReactDOMServer.renderToStaticMarkup(html))
    } catch (error) {
      next(error)
    }
  }
}
