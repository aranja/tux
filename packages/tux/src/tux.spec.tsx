import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import createTux, { createContext, startClient, serve, Tux } from './tux'

describe('createContext', () => {
  it('should be callable', () => {
    expect(typeof createContext).toBe('function')
  })

  it('should create a context object', () => {
    const context = createContext()
    expect(context).not.toBeUndefined()
    expect(context).toEqual({
      htmlProps: {},
    })
  })

  it('should take properties as arguments', () => {
    const context = createContext({ foo: 'bar' })
    expect(context).toEqual({
      htmlProps: {},
      foo: 'bar',
    })
  })
})

describe('tux.use', () => {
  test('is callable', () => {
    const tux = createTux()
    expect(typeof tux.use).toBe('function')
  })

  test('is chainable', () => {
    const tux = createTux()
    expect(tux.use({})).toBe(tux)
  })

  test('createElement gets wrapped', async () => {
    const tux = createTux()

    tux.use({
      async createElement() {
        return <div>dummy element</div>
      },
    })

    const element = await tux.getElement()
    const wrapper = shallow(element)
    const instance = wrapper.instance()

    expect(instance.constructor.name).toBe('TuxBase')
    expect(wrapper.html()).toBe('<div>dummy element</div>')
  })

  test('wraps same TuxBase component each time', async () => {
    const tux = createTux()
    const element1 = await tux.getElement()
    const element2 = await tux.getElement()
    expect(element1.type).toEqual(element2.type)
  })

  test('createElement can modify the context', async () => {
    const tux = createTux()

    tux.use({
      async createElement(renderChildren, context) {
        context.htmlProps.someEdit = 'someEdit'
        return await renderChildren()
      }
    })

    tux.use({
      async createElement(renderChildren, context) {
        context.htmlProps.someEdit += ' anotherEdit'
        return await renderChildren()
      }
    })

    const context = createContext()
    await tux.getElement(context)

    expect(context).toEqual({
      htmlProps: {
        someEdit: 'someEdit anotherEdit',
      },
    })
  })

  test('renderChildren should always be callable', async () => {
    const tux = createTux()

    tux.use({
      async createElement(renderChildren) {
        const element = await renderChildren()
        return <div className="wrap">{element}</div>
      },
    })

    const element = await tux.getElement()
    const wrapper = shallow(element)

    expect(wrapper.html()).toBe('<div class="wrap"></div>')
  })

  test('middleware is not required', async () => {
    const tux = createTux()
    const element = await tux.getElement()
    expect(element.props).toHaveProperty('context', {
      htmlProps: {},
    })
  })

  it('should accept a function [createElement] that returns a promise', async () => {
    const tux = createTux()
    const createElementMock = jest.fn(() => Promise.resolve())
    tux.use(createElementMock)
    await tux.getElement()
    expect(createElementMock).toHaveBeenCalled()
  })

  it('should throw when createElement is not a function', () => {
    const tux = createTux()
    expect(() => {
      tux.use({
        createElement: 'not a function',
      })
    }).toThrowErrorMatchingSnapshot()
  })

  it('should throw when wrapClientRender is not a function', () => {
    const tux = createTux()
    expect(() => {
      tux.use({
        wrapClientRender: 'not a function',
      })
    }).toThrowErrorMatchingSnapshot()
  })

  it('should throw when wrapServerRender is not a function', () => {
    const tux = createTux()
    expect(() => {
      tux.use({
        wrapServerRender: 'not a function',
      })
    }).toThrowErrorMatchingSnapshot()
  })
})

describe('tux.renderServer', () => {
  it('should be callable', () => {
    const tux = createTux()
    expect(typeof tux.renderServer).toBe('function')
  })

  it('should return the string returned from the callback', () => {
    const tux = createTux()
    const body = tux.renderServer(createContext(), () => 'foo')
    expect(body).toBe('foo')
  })

  test('unfolds the middleware chain', () => {
    const wrapServerRender1 = jest.fn((render) => render())
    const wrapServerRender2 = jest.fn((render) => render())
    const tux = createTux()
    tux.use({ wrapServerRender: wrapServerRender1 })
    tux.use({ wrapServerRender: wrapServerRender2 })
    tux.renderServer(createContext(), () => '')
    expect(wrapServerRender1).toBeCalled()
    expect(wrapServerRender2).toBeCalled()
  })

  test('wrapServerRender can modify the context', () => {
    const tux = createTux()

    tux.use({
      wrapServerRender(render, context) {
        context.htmlProps.someEdit = 'someEdit'
        render()
      }
    })

    tux.use({
      wrapServerRender(render, context) {
        context.htmlProps.someEdit += ' anotherEdit'
        render()
      }
    })

    const context = createContext()
    tux.renderServer(context, () => '')
    expect(context).toHaveProperty('htmlProps', {
      someEdit: 'someEdit anotherEdit',
    })
  })
})

describe('tux.renderClient', () => {
  it('should be callable', () => {
    const tux = createTux()
    expect(typeof tux.renderClient).toBe('function')
  })

  it('unfolds the middleware chain', () => {
    const wrapClientRender1 = jest.fn((render) => render())
    const wrapClientRender2 = jest.fn((render) => render())
    const tux = createTux()
    tux.use({ wrapClientRender: wrapClientRender1 })
    tux.use({ wrapClientRender: wrapClientRender2 })
    tux.renderClient(createContext(), () => '')
    expect(wrapClientRender1).toBeCalled()
    expect(wrapClientRender2).toBeCalled()
  })

  it('can modify the context', () => {
    const tux = createTux()

    tux.use({
      wrapClientRender(render, context) {
        context.htmlProps.someEdit = 'someEdit'
        render()
      }
    })

    tux.use({
      wrapClientRender(render, context) {
        context.htmlProps.someEdit += ' anotherEdit'
        render()
      }
    })

    const context = createContext()
    tux.renderClient(context, () => '')
    expect(context).toHaveProperty('htmlProps', {
      someEdit: 'someEdit anotherEdit',
    })
  })

  it('should have after render callback', async () => {
    const tux = createTux()
    const context = createContext()
    let hasRendered = false

    await tux.renderClient(context, () => {
      hasRendered = true
    })

    expect(hasRendered).toBeTruthy()
  })
})

describe('startClient', () => {
  let appRoot: Element
  let tux: Tux

  beforeEach(() => {
    tux = createTux()
    appRoot = document.createElement('div')
    document.body.appendChild(appRoot)
  })

  it('should be callable', () => {
    expect(typeof startClient).toBe('function')
  })

  it('should return a promise', () => {
    const client = startClient(tux, appRoot)
    expect(typeof client.then).toBe('function')
    expect(typeof client.catch).toBe('function')
  })

  it('should await getElement before rendering', async () => {
    let runOrder = 0
    tux.getElement = jest.fn(() => { runOrder = 2 })
    tux.renderClient = jest.fn(() => { runOrder *= 4 })
    await startClient(tux, appRoot)
    expect(tux.getElement).toHaveBeenCalled()
    expect(tux.renderClient).toHaveBeenCalled()
    expect(runOrder).toBe(8)
  })

  it('should add a refresh function on the context', async () => {
    let context = { refresh: null }
    tux.getElement = jest.fn((internalContext) => { context = internalContext })
    tux.renderClient = jest.fn()
    await startClient(tux, appRoot)
    expect(typeof context.refresh).toBe('function')
  })

  it('should render a React component to the appRoot', async () => {
    tux.use(() => <div>React Element</div>)
    await startClient(tux, appRoot)
    expect(appRoot.innerHTML).toMatchSnapshot()
  })

  it('should rerender when refresh is called', (done) => {
    let renderCount = 0

    function onComplete() {
      expect(renderCount).toBe(2)
      done()
    }

    tux.use(() => <div>Render count {++renderCount}</div>)

    tux.use({
      wrapClientRender(render, context) {
        if (renderCount === 1 && context.refresh) {
          context.refresh(onComplete)
        }
        render()
      }
    })

    startClient(tux, appRoot)
  })
})

describe('serve', () => {
  let tux: Tux

  beforeEach(() => {
    tux = createTux()
  })

  it('should be callable', () => {
    expect(typeof serve).toBe('function')
  })
})
