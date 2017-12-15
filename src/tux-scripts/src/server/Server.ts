import express from 'express'
import { join } from 'path'
import { MultiCompiler, Compiler } from 'webpack'
import selfsigned from 'selfsigned'
import { Server as NetServer } from 'net'
import http from 'http'
import spdy from 'spdy'
import fs from 'fs'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'

export interface ServerOptions {
  buildPath: string
  port: number
  host: string
  https: boolean | spdy.ServerOptions
  multiCompiler?: MultiCompiler
}

class Server {
  app: express.Express
  server: NetServer
  options: ServerOptions

  constructor(options: Partial<ServerOptions>) {
    this.options = {
      port: options.port || 5000,
      host: options.host || '0.0.0.0',
      buildPath: options.buildPath || join(process.cwd(), 'build'),
      multiCompiler: options.multiCompiler,
      https: options.https || false,
    }
    this.app = express()

    this.configureApp()
    this.createServer()
  }

  configureApp() {
    const { buildPath, multiCompiler } = this.options

    if (process.env.NODE_ENV === 'development') {
      this.app.use(errorOverlayMiddleware())
    }

    if (multiCompiler) {
      const webpackDevMiddleware = require('webpack-dev-middleware')
      const webpackHotMiddleware = require('webpack-hot-middleware')
      const webpackHotServerMiddleware = require('webpack-hot-server-middleware')

      const clientCompiler = (multiCompiler as any).compilers.find(
        (childCompiler: Compiler) => childCompiler.name === 'client'
      )

      this.app.use(
        webpackDevMiddleware(multiCompiler, {
          serverSideRender: true,
          index: false,
          quiet: true,
        })
      )

      this.app.use(webpackHotMiddleware(clientCompiler, { log: false }))

      this.app.use(
        webpackHotServerMiddleware(multiCompiler, {
          chunkName: 'index',
        })
      )
    } else if (buildPath) {
      // Serve a pre-built app.
      // Start by finding all the relevant files.
      const CLIENT_ASSETS_DIR = join(buildPath, 'static')
      const CLIENT_STATS_PATH = join(CLIENT_ASSETS_DIR, 'stats.json')
      const SERVER_RENDERER_PATH = join(buildPath, 'ssr')
      const SERVER_STATS_PATH = join(SERVER_RENDERER_PATH, 'stats.json')

      // Load server bundle and webpack stats.
      let serverRenderer = require(SERVER_RENDERER_PATH)
      serverRenderer = serverRenderer.__esModule
        ? serverRenderer.default
        : serverRenderer
      const clientStats = require(CLIENT_STATS_PATH)
      const serverStats = require(CLIENT_STATS_PATH)

      // Serve static files and server renderer.
      this.app.use(express.static(CLIENT_ASSETS_DIR, { index: false }))
      this.app.use(serverRenderer({ clientStats, serverStats }))
    } else {
      throw new Error(
        'Must pass either buildPath or webpack compiler to tux server.'
      )
    }
  }

  createServer() {
    let https = this.options.https

    if (https) {
      // for keep supporting CLI parameters
      if (typeof https === 'boolean') {
        https = {
          requestCert: false,
        }
      }

      let fakeCert
      if (!https.key || !https.cert) {
        // Use a self-signed certificate if no certificate was configured.
        // Cycle certs every 24 hours
        const certPath = join(__dirname, '../../ssl/server.pem')
        let certExists = fs.existsSync(certPath)

        if (certExists) {
          const certStat = fs.statSync(certPath)
          const certTtl = 1000 * 60 * 60 * 24
          const now = new Date()

          // cert is more than 30 days old, kill it with fire
          if ((now.getTime() - certStat.ctime.getTime()) / certTtl > 30) {
            console.log('SSL Certificate is more than 30 days old. Removing.')
            fs.unlinkSync(certPath)
            certExists = false
          }
        }

        if (!certExists) {
          console.log('Generating SSL Certificate')
          const attrs = [{ name: 'commonName', value: 'localhost' }]
          const pems = selfsigned.generate(attrs, {
            algorithm: 'sha256',
            days: 30,
            keySize: 2048,
            extensions: [
              {
                name: 'basicConstraints',
                cA: true,
              },
              {
                name: 'keyUsage',
                keyCertSign: true,
                digitalSignature: true,
                nonRepudiation: true,
                keyEncipherment: true,
                dataEncipherment: true,
              },
              {
                name: 'subjectAltName',
                altNames: [
                  {
                    // type 2 is DNS
                    type: 2,
                    value: 'localhost',
                  },
                  {
                    type: 2,
                    value: 'localhost.localdomain',
                  },
                  {
                    type: 2,
                    value: 'lvh.me',
                  },
                  {
                    type: 2,
                    value: '*.lvh.me',
                  },
                  {
                    type: 2,
                    value: '[::1]',
                  },
                  {
                    // type 7 is IP
                    type: 7,
                    ip: '127.0.0.1',
                  },
                  {
                    type: 7,
                    ip: 'fe80::1',
                  },
                ],
              },
            ],
          })

          fs.writeFileSync(certPath, pems.private + pems.cert, {
            encoding: 'utf-8',
          })
        }
        fakeCert = fs.readFileSync(certPath)
      }

      https.key = https.key || fakeCert
      https.cert = https.cert || fakeCert

      if (!https.spdy) {
        https.spdy = {
          protocols: ['h2', 'http/1.1'],
        }
      }

      this.server = spdy.createServer(https, this.app)
    } else {
      this.server = http.createServer(this.app)
    }
  }

  /**
   * Launch the server
   */
  listen() {
    const { host, port } = this.options
    return new Promise((resolve, reject) => {
      this.server.listen(
        port,
        host,
        (err: Error) => (err ? reject(err) : resolve())
      )
    })
  }
}

export default Server
