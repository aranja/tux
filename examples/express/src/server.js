import { serve, buildAssets } from 'tux'
import Document from 'react-document'
import app from './app'
import express from 'express'

export default ({ clientStats }) => {
  const expressApp = express()
  expressApp.use((req, res, next) => {
    console.log('Hi from server process')
    next()
  })
  expressApp.use(serve({
    Document,
    assets: buildAssets(clientStats),
    app,
  }))
  return expressApp
}
