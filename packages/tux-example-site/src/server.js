import 'babel-polyfill'
import path from 'path'
import express from 'express'
import PrettyError from 'pretty-error'
import React from 'react'
import assets from 'asset-manifest'
import Html from './Html'
import chain from './app'
import { renderServer } from 'react-chain'

const app = express()

app.use(express.static(path.join(__dirname, 'static'), { index: false }))

/**
 * Server-side rendering middleware
 */
app.get('*', renderServer(chain, { assets, Document: Html }))

/**
 * Error handling
 */
const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)) // eslint-disable-line no-console
})

/**
 * Launch the server
 */
export const port = process.env.PORT || 3000
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`)
  /* eslint-enable no-console */
})
