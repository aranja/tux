import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import createTux from './tux'

describe('tux.use', () => {
  test('is callable', () => {
    const tux = createTux()
    expect(typeof tux.use).toBe('function')
  })

  test('is chainable', () => {
    const tux = createTux()
    expect(tux.use({})).toBe(tux)
  })

  test('creates a base context', async () => {
    const tux = createTux()
    const { context } = await tux.getElement()
    expect(context).toEqual({ htmlProps: {} })
  })

  test('createElement gets wrapped', async () => {
    const tux = createTux()

    tux.use({
      async createElement() {
        return <div>dummy element</div>
      },
    })

    const { element } = await tux.getElement()
    const wrapper = shallow(element)
    const instance = wrapper.instance()

    expect(instance.constructor.name).toBe('TuxBase')
    expect(wrapper.html()).toBe('<div>dummy element</div>')
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

    const { context } = await tux.getElement()

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

    const { element } = await tux.getElement()
    const wrapper = shallow(element)

    expect(wrapper.html()).toBe('<div class="wrap"></div>')
  })

  test('can wrap server render', (done) => {
    const wrapServerRender = jest.fn((render) => render())

    const tux = createTux({
      renderToString() {
        expect(wrapServerRender).toBeCalled()
        done()
      }
    })

    tux.use({ wrapServerRender }).startServer()
  })

  test('can wrap client render', (done) => {
    const wrapClientRender = jest.fn((render) => render())

    const tux = createTux({
      renderToDOM() {
        expect(wrapClientRender).toBeCalled()
        done()
      }
    })

    tux.use({ wrapClientRender }).startClient()
  })

  test('wrapClientRender can modify the context', (done) => {
    const tux = createTux({
      renderToDOM(element: ReactElement<any>) {
        const { props } = shallow(element).instance()
        expect(props).toHaveProperty('context', {
          htmlProps: {
            someEdit: 'someEdit anotherEdit',
          },
        })
        done()
      }
    })

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

    tux.startClient()
  })

  test('wrapServerRender can modify the context', (done) => {
    const tux = createTux({
      renderToString(element: ReactElement<any>) {
        const { props } = shallow(element).instance()
        expect(props).toHaveProperty('context', {
          htmlProps: {
            someEdit: 'someEdit anotherEdit',
          },
        })
        done()
      }
    })

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

    tux.startServer()
  })
})

