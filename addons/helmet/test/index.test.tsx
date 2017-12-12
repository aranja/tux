import React from 'react'
import { Helmet } from 'react-helmet'
import ReactDOMServer from 'react-dom/server'
import helmetAddon from '../src'

describe('Helmet addon', () => {
  beforeAll(() => {
    Helmet.canUseDOM = false
  })

  it('should not override existing session properties', () => {
    ReactDOMServer.renderToString(
      <Helmet>
        <title>Tux Helmet Addon</title>
      </Helmet>
    )

    const session = {
      document: {
        htmlProps: { foo: 'bar' },
        bodyProps: { foo: 'bar' },
        head: ['test'],
      },
      on(env, fn) {
        fn(() => {})
      },
    }

    helmetAddon()(session)

    expect(session.document.htmlProps).toHaveProperty('foo', 'bar')
    expect(session.document.bodyProps).toHaveProperty('foo', 'bar')
    expect(session.document.head).toHaveLength(2)
  })

  it('renders title tag on the server', () => {
    ReactDOMServer.renderToString(
      <Helmet>
        <title>Tux Helmet Addon</title>
      </Helmet>
    )

    const session = {
      document: {
        htmlProps: {},
        bodyProps: {},
        head: [],
      },
      helmet: {},
      on(env, fn) {
        fn(() => {})
      },
    }

    helmetAddon()(session)

    expect(session.document.head).toHaveLength(1)
    expect(session.document.head[0].type).toEqual('title')
    expect(session.document.head[0].props.children).toEqual('Tux Helmet Addon')
  })
})
