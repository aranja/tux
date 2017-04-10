import express from 'express'
import { join } from 'path'
import tuxMiddleware from './tuxMiddleware'

export interface ServerOptions {
  buildPath: string,
  port: number
  host: string
}

class Server {
  app: express.Express
  options: ServerOptions

  constructor(options: Partial<ServerOptions>) {
    this.options = {
      port: options.port || process.env.PORT || 3000,
      host: options.host || 'localhost',
      buildPath: options.buildPath || join(process.cwd(), 'build'),
    }
    this.app = express()

    this.configureApp()

    this.listen()
  }

  configureApp() {
    this.app.use(express.static(join(this.options.buildPath, 'static'), { index: false }))

    this.app.use(tuxMiddleware({
      buildPath: this.options.buildPath
    }))
  }

  /**
   * Launch the server
   */
  listen() {
    const { host, port } = this.options
    this.app.listen(port, host, () => {
      // tslint:disable-next-line:no-console
      console.log(`The server is running at http://${host}:${port}/`)
    })
  }
}

export default Server
