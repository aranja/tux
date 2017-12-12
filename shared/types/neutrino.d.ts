declare module '@neutrinojs/env'
declare module '@neutrinojs/banner'
declare module '@neutrinojs/compile-loader'
declare module '@neutrinojs/react'
declare module '@neutrinojs/hot'
declare module 'neutrino' {
  import Config from 'webpack-chain'
  import { Compiler, Configuration, Stats } from 'webpack'

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

  export interface Neutrino {
    config: Config
    options: Options | any
    commands: {
      [command: string]: (
        config: Configuration | Configuration[],
        api: Neutrino
      ) => any
    }

    on(event: string, callback: Function): void
    use(preset: Middleware, options?: any): void
    getWebpackOptions(): any
    emitForAll(eventName: string, payload: any): Promise<Array<any>>
    register(
      command: string,
      handler: (config: any, api: Neutrino) => void
    ): void
    run(command: 'build'): Future<Stats>
    run(command: 'start'): Future<Compiler>
    run(command: 'inspect'): Future<string>
    run(
      command: 'build' | 'start' | 'inspect' | 'test',
      middleware: any[]
    ): Future<Stats | Compiler | string>
    requiresAndUses(middleware: string[]): Future<any>
  }
  export function Neutrino(options: Options | any): Neutrino

  export function run(
    command: string,
    middleware: any[],
    options: Options | any
  ): Future<any>
  export function start(
    middleware: any[],
    options: Options | any
  ): Future<Compiler>
  export function build(
    middleware: any[],
    options: Options | any
  ): Future<Compiler>
  export function inspect(
    middleware: any[],
    options: Options | any
  ): Future<string>
  export function test(
    middleware: any[],
    options: Options | any
  ): Future<string>
}
