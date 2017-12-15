export type Target = 'browser' | 'server' | 'multi'

export interface Options {
  browserEntry?: string
  serverEntry?: string
  command?: string
  entry?: string
  output?: string
  target?: string
  quiet?: boolean
  mains?: {
    index?: string
  }
  tux?: {
    admin?: boolean
  }
  env?: {
    [key: string]: string
  }
}

export interface Args {
  options: Options
  target?: Target
  middleware: any[]
  host?: string
  port?: number
  https?: boolean
}
