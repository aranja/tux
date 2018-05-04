import createReactChain, { ReactChain, Session } from 'react-chain'
import { hydrate } from 'react-dom'
import DocumentMiddleware, { DocumentSession } from './DocumentMiddleware'

export { TuxServerSession as ServerSession } from './server'

export { DocumentSession }

export type TuxBrowserSession = Session &
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
  const session = app.createSession() as TuxBrowserSession

  session.refresh = async onComplete =>
    await app.renderBrowser(session, element => {
      // ts: element argument doesn't match correctly.
      ;(hydrate as any)(element, container, onComplete)
    })

  session.refresh()
}
