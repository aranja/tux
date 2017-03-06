import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

export interface Context {
  htmlProps: any
}

export type ReactElement =
  React.ReactElement<any>

export type WrapElement =
  (renderChildren: () => Promise<null | ReactElement>, context: Context) =>
    Promise<ReactElement>

export type WrapRender =
  (render: Function, context?: Object) =>
    void

export interface Middleware {
  createElement?: WrapElement
  wrapClientRender?: WrapRender
  wrapServerRender?: WrapRender
}

export interface Config {
  container?: () => null | Element,
  renderToDOM: (element: ReactElement | null, container: Element) => string
  renderToString: (element: ReactElement) => string
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

  private config: Config
  private initialRender: boolean

  constructor(config: Config) {
    this.initialRender = true
    this.config = config
  }

  use(middleware: Middleware) {
    if (typeof middleware.createElement !== 'undefined') {
      this.elementWrappers.push(middleware.createElement)
    }

    if (typeof middleware.wrapClientRender !== 'undefined') {
      this.wrapClientRenderers.push(middleware.wrapClientRender)
    }

    if (typeof middleware.wrapServerRender !== 'undefined') {
      this.wrapServerRenderers.push(middleware.wrapServerRender)
    }

    return this
  }

  async startClient() {
    const element = await this.getElement()

    this.wrapClientRenderers.push(() => {
      const { renderToDOM, container } = this.config

      if (typeof container === 'function') {
        renderToDOM(element, container())
      }
    })

    this.renderWrapper(this.wrapClientRenderers)
  }

  async startServer() {
    const element = await this.getElement()

    this.wrapServerRenderers.push(() => {
      this.config.renderToString(element)
    })

    this.renderWrapper(this.wrapServerRenderers)
  }

  async getElement() {
    const context = { htmlProps: {} }
    const elementWrappers = [createBase, ...this.elementWrappers]

    let index = 0

    async function next(): Promise<any> {
      const createElement = elementWrappers[index]

      if (elementWrappers[index + 1] == null) {
        return createElement(() => Promise.resolve(null), context)
      }

      index += 1

      return createElement(await next, context)
    }

    return await next()
  }

  private renderWrapper(wrappers: Array<Function>) {
    const wrapRender = wrappers.shift()
    if (wrapRender) {
      wrapRender(wrappers[0])
      this.renderWrapper(wrappers)
    }
  }
}

export default function createTux(config = {}) {
  return new Tux(Object.assign({
    container: () => null,
    renderToDOM: ReactDOM.render,
    renderToString: ReactDOMServer.renderToString,
  }, config))
}
