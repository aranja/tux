import { ReactElement } from 'react'
import Helmet, { HelmetData } from 'react-helmet'
import { Middleware } from 'react-chain'
import { DocumentSession } from 'tux'

interface HelmetSession extends DocumentSession {
  helmet: HelmetData
}

const helmet = (): Middleware => (session: HelmetSession) => {
  session.on('server', render => {
    render()
    const data = Helmet.renderStatic()
    session.helmet = data

    Object.assign(session.document.htmlProps, data.htmlAttributes.toComponent())
    Object.assign(session.document.bodyProps, data.bodyAttributes.toComponent())
    session.document.head.push(
      // @types/react-helmet returns wrong types.
      ...(<any>data.title.toComponent()),
      ...(<any>data.meta.toComponent()),
      ...(<any>data.link.toComponent()),
      ...(<any>data.style.toComponent()),
      ...(<any>data.noscript.toComponent()),
      ...(<any>data.script.toComponent())
    )
  })
}

export default helmet
