declare module 'neutrino' {
  import Config from 'webpack-chain'
  import { Compiler, Stats } from 'webpack'

  interface Future<T> {
    promise(): Promise<T>
  }

  interface Options {
    root?: string
    source?: string
    output?: string
    tests?: string
    node_modules?: string
    entry?: string
  }

  export type Middleware = (neutrino: Neutrino, options?: any) => void

  export class Neutrino {
    constructor(options: Options | any)
    config: Config
    options: Options | any

    use(preset: Middleware, options?: any): void
    getWebpackOptions(): any
    run(command: 'build'): Future<Stats>
    run(command: 'start'): Future<Compiler>
    run(command: 'inspect'): Future<string>
    run(command: 'build' | 'start' | 'inspect'): Future<Stats | Compiler | string>
  }

  export function run(command: string, middleware: any[], options: Options | any): Future<any>
  export function start(middleware: any[], options: Options | any): Future<Compiler>
  export function build(middleware: any[], options: Options | any): Future<Compiler>
  export function inspect(middleware: any[], options: Options | any): Future<string>
}
