import React from 'react'
import { Helmet } from 'react-helmet'
import ReactDOMServer from 'react-dom/server'
import helmetAddon from '../src'

describe('Helmet addon', () => {
  beforeAll(() => {
    Helmet.canUseDOM = false
  })

  it('renders title tag on the server', () => {
    ReactDOMServer.renderToString(
      <Helmet>
        <title>Tux Helmet Addon</title>
      </Helmet>
    )

    let session = {
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
