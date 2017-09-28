import createReactChain, { ReactChain } from 'react-chain'
import { render } from 'react-dom'
import DocumentMiddleware from './DocumentMiddleware'

export const createApp = () => {
  const app = createReactChain()
  app.use(DocumentMiddleware)
  return app
}

export const start = (
  app: ReactChain,
  container = document.getElementById('app')
) => {
  const session = app.createSession()

  async function refresh(onComplete?: (element: Element) => void) {
    return await app.renderBrowser(session, (element: any) => {
      render(element, container, onComplete)
    })
  }

  session.refresh = refresh
  refresh()
}

export const serve = app => (req, res, next) => {}
