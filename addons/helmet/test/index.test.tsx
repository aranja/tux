import React from 'react'
import { Helmet } from 'react-helmet'
import ReactDOMServer from 'react-dom/server'
import helmetAddon from '../src'

describe('Helmet addon', () => {
  beforeAll(() => {
    Helmet.canUseDOM = false
  })

  it('should make sure that relevant properties exist on the session', () => {
    ReactDOMServer.renderToString(
      <Helmet>
        <title>Tux Helmet Addon</title>
      </Helmet>
    )

    const session = {
      on(env, fn) {
        fn(() => {})
      },
    }

    helmetAddon()(session)

    expect(typeof session.htmlProps).toBe('object')
    expect(typeof session.bodyProps).toBe('object')
    expect(Array.isArray(session.head)).toBeTruthy()
  })

  it('should not override existing session properties', () => {
    ReactDOMServer.renderToString(
      <Helmet>
        <title>Tux Helmet Addon</title>
      </Helmet>
    )

    const session = {
      htmlProps: { foo: 'bar' },
      bodyProps: { foo: 'bar' },
      head: ['test'],
      on(env, fn) {
        fn(() => {})
      },
    }

    helmetAddon()(session)

    expect(session.htmlProps).toHaveProperty('foo', 'bar')
    expect(session.bodyProps).toHaveProperty('foo', 'bar')
    expect(session.head).toHaveLength(2)
  })

  it('renders title tag on the server', () => {
    ReactDOMServer.renderToString(
      <Helmet>
        <title>Tux Helmet Addon</title>
      </Helmet>
    )

    const session = {
      data: {},
      htmlProps: {},
      bodyProps: {},
      head: [],
      on(env, fn) {
        fn(() => {})
      },
    }

    helmetAddon()(session)

    expect(session.data).toEqual({})
    expect(session.head).toHaveLength(1)
    expect(session.head[0].type).toEqual('title')
    expect(session.head[0].props.children).toEqual('Tux Helmet Addon')
  })
})
