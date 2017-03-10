import React, { createElement, Component } from 'react'
import ReactDOM from 'react-dom'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'

export interface Context {
  htmlProps: any
  refresh?:
    (onComplete: () => void) =>
      Promise<any>
}

export type ReactElement =
  React.ReactElement<any>

export type WrapElement =
  (renderChildren: () => Promise<null | ReactElement>, context: Context) =>
    Promise<ReactElement>

export type WrapRender =
  (render: Function, context: Context) =>
    void

export interface Middleware {
  createElement?: WrapElement
  wrapClientRender?: WrapRender
  wrapServerRender?: WrapRender
}

export function createContext(newContext?: Object): Context {
  const htmlProps = {}
  return Object.assign({ htmlProps }, newContext)
}

export function startClient(tux: Tux, domNode: Element) {
  const context = createContext()
  async function refresh(onComplete = () => {}) {
    const element = await tux.getElement(context)
    return await tux.renderClient(context, () => {
      ReactDOM.render(element, domNode, onComplete)
    })
  }
  context.refresh = refresh
  return refresh()
}

export function serve(tux: Tux, config: {
  assets?: any,
  Document?: React.ComponentClass<any>,
} = {}) {
  if (typeof config.Document === 'undefined') {
    throw new Error()
  }
  return async function server(request?: any, response?: any, next?: Function) {
    const context = createContext({ request, response })
    let html = ''

    try {
      const element = await tux.getElement(context)
      const body = tux.renderServer(context, () => renderToString(element))
      const { htmlProps, request, response, ...rest } = context
      html = renderToStaticMarkup(createElement(config.Document, {
        ...htmlProps,
        assets: config.assets || {},
        context: { ...rest },
      }, body))
    } catch (error) {
      const { htmlProps, request, response, ...rest } = context
      html = renderToStaticMarkup(createElement(config.Document, {
        ...htmlProps,
        assets: config.assets || {},
        context: { ...rest },
        title: 'Internal Server Error',
        description: error.message,
      }, error.toString()))

      response.status(error.status || 500)

      if (typeof next === 'function') {
        next(error)
      }
    }
    response.send(`<!doctype html>${html}`)
  }
}

async function createBase(renderChildren: null | (() => Promise<ReactElement>), context: Context) {
  const element = renderChildren && await renderChildren()

  class TuxBase extends React.Component<any, any> {
    static childContextTypes = {
      htmlProps: React.PropTypes.object.isRequired,
    }

    static propTypes = {
      context: React.PropTypes.object,
      children: React.PropTypes.node,
    }

    getChildContext() {
      return this.props.nextContext
    }

    render() {
      return element
    }
  }

  return Promise.resolve(React.createElement(TuxBase, { context }))
}

export class Tux {
  protected elementWrappers: Array<WrapElement> = []
  protected wrapClientRenderers: Array<WrapRender> = []
  protected wrapServerRenderers: Array<WrapRender> = []

  use(middleware: WrapElement | Middleware) {
    if (typeof middleware === 'function') {
      middleware = {
        createElement: middleware,
      }
    }

    if (middleware.createElement) {
      if (typeof middleware.createElement !== 'function') {
        throw new Error('[tux.use] createElement should be a function.')
      }
      this.elementWrappers.push(middleware.createElement)
    }

    if (middleware.wrapClientRender) {
      if (typeof middleware.wrapClientRender !== 'function') {
        throw new Error('[tux.use] wrapClientRender should be a function.')
      }
      this.wrapClientRenderers.push(middleware.wrapClientRender)
    }

    if (middleware.wrapServerRender) {
      if (typeof middleware.wrapServerRender !== 'function') {
        throw new Error('[tux.use] wrapServerRender should be a function.')
      }
      this.wrapServerRenderers.push(middleware.wrapServerRender)
    }

    return this
  }

  async getElement(context: Context = createContext()): Promise<ReactElement> {
    const elementWrappers = [createBase, ...this.elementWrappers]
    let index = 0

    async function next(): Promise<any> {
      const createElement = elementWrappers[index++]
      const renderChildren = elementWrappers[index]
        ? await next
        : () => Promise.resolve(null)
      return createElement(renderChildren, context)
    }

    return await next()
  }

  renderClient(context: Context, onRender: Function) {
    return new Promise(resolve => {
      this.renderWrapper(this.wrapClientRenderers, context, () => {
        onRender()
        resolve()
      })
    })
  }

  renderServer(context: Context, onRender: Function) {
    let body: string = ''
    this.renderWrapper(this.wrapServerRenderers, context, () => {
      body = onRender()
    })
    return body
  }

  private renderWrapper(wrappers: Array<WrapRender>, context: Context, onComplete: () => void) {
    let index = 0

    if (wrappers.length === 0) {
      onComplete()
      return
    }

    function render() {
      const wrap = wrappers[index++]
      wrap(wrappers[index] == null ? onComplete : render, context)
    }

    render()
  }
}

export default function createTux() {
  return new Tux()
}
