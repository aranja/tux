import 'babel-polyfill'
import path from 'path'
import express from 'express'
import PrettyError from 'pretty-error'
import React from 'react'
import assets from 'asset-manifest'
import Html from './Html'
import app from './app'
import ReactDOMServer from 'react-dom/server'

const server = express()
const pe = new PrettyError()

server.use(express.static(path.join(__dirname, 'static'), { index: false }))

/**
 * Server-side rendering middleware
 */
server.use('*', async function (req, res, next) {
  const session = app.createSession()

  session.req = req
  session.res = res

  try {
    const body = await app.renderServer(session, ReactDOMServer.renderToString)
    res.status(session.status || 200)
    res.send('<!doctype html>' + ReactDOMServer.renderToStaticMarkup(
      <Html {...session} assets={assets}>{body}</Html>
    ))
  } catch (error) {
    pe.skipNodeFiles()
    pe.skipPackage('express')
    console.log(pe.render(error)) // eslint-disable-line no-console
    next(error)
  }
})

/**
 * Launch the server
 */
export const port = process.env.PORT || 3000
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`)
  /* eslint-enable no-console */
})
