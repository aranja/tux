import express from 'express'
import { join } from 'path'
import { MultiCompiler } from 'webpack'
import fs from 'fs'
import DefaultDocument from 'react-document'

export interface ServerOptions {
  buildPath: string
  port: number
  host: string
  multiCompiler: MultiCompiler
}

class Server {
  app: express.Express
  options: ServerOptions

  constructor(options: Partial<ServerOptions>) {
    this.options = {
      port: options.port || process.env.PORT || 5000,
      host: options.host || '0.0.0.0',
      buildPath: options.buildPath || join(process.cwd(), 'build'),
      multiCompiler: options.multiCompiler,
    }
    this.app = express()

    this.configureApp()

    this.listen()
  }

  configureApp() {
    const { buildPath, multiCompiler } = this.options

    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware')

    const clientCompiler = multiCompiler.compilers.find(
      compiler => compiler.name === 'client'
    )

    this.app.use(
      webpackDevMiddleware(multiCompiler, {
        serverSideRender: true,
        index: false,
        stats: {
          colors: true,
        },
      })
    )

    this.app.use(webpackHotMiddleware(clientCompiler))

    this.app.use(
      webpackHotServerMiddleware(multiCompiler, {
        chunkName: 'app',
        serverRendererOptions: {},
      })
    )
  }

  /**
   * Launch the server
   */
  listen() {
    const { host, port } = this.options
    this.app.listen(port, host)
  }
}

export default Server
