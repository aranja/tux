const DocumentMiddleware = session => {
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
