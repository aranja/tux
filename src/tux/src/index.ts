import createReactChain, { ReactChain, Session } from 'react-chain'
import { render } from 'react-dom'
import express from 'express'
import DocumentMiddleware, { DocumentSession } from './DocumentMiddleware'

export type TuxSession = Session &
  DocumentSession & {
    refresh: (onComplete?: (element: Element) => void) => Promise<any>
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
  const session = app.createSession() as TuxSession

  session.refresh = async onComplete =>
    await app.renderBrowser(session, element => {
      render(element, container, onComplete)
    })

  session.refresh()
}

export const serve = (app: ReactChain): express.RequestHandler => (
  req,
  res,
  next
) => {
  // TODO: Implement ssr
}
