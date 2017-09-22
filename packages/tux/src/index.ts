import createReactChain, { ReactChain } from 'react-chain'
import DocumentMiddleware from './DocumentMiddleware'

export const createApp = () => {
  const app = createReactChain()
  app.use(DocumentMiddleware)
  return app
}

export const start = app => {
  app.renderBrowser()
}

export const serve = app => (req, res, next) => {}
