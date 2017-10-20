import { ReactElement } from 'react'
import { Session } from 'react-chain'

export type DocumentSession = {
  document: {
    htmlProps: { [key: string]: string }
    bodyProps: { [key: string]: string }
    head: ReactElement<any>[]
    footer: ReactElement<any>[]
    css: string[]
    js: string[]
    window: { [key: string]: any }
  }
}

const DocumentMiddleware = (session: Session & DocumentSession) => {
  session.document = {
    htmlProps: {},
    bodyProps: {},
    head: [],
    footer: [],
    js: [],
    css: [],
    window: typeof window === 'undefined' ? {} : window,
  }
}

export default DocumentMiddleware
