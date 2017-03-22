import express from 'express'
import { join } from 'path'
import fs from 'fs'
import DefaultDocument from 'react-document'
import { renderServer } from 'react-chain'

export interface Options {
  buildPath: string,
}

const tuxMiddleware = (options: Options): express.RequestHandler => {
  const appModule = require(join(options.buildPath, 'ssr/app.js'))
  const app = appModule.__esModule ? appModule.default : appModule
  const assets = require(join(options.buildPath, 'static/assets.json'))

  const documentPath = join(options.buildPath, 'ssr/document.js')
  let Document = DefaultDocument
  if (fs.existsSync(documentPath)) {
    Document = require(documentPath)
  }
  return renderServer(app, { assets, Document })
}

export default tuxMiddleware
