import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ServerSession } from 'tux'
import addon from '../src'

describe('react-router addon', () => {
  test('the addon is a middleware that returns a promise', () => {
    const middleware = addon()
    const session = { on() {} }
    const result = middleware(session as ServerSession)
    expect(typeof result).toBe('function')
  })
})
