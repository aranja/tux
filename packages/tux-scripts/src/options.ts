export interface Options {
  entry?: string
  output?: string
  target?: string
  quiet?: boolean
  https?: boolean
  port?: number
  host?: string
  tux?: {
    admin?: boolean
  }
  env?: {
    [key: string]: string
  }
}

export interface Args {
  options: Options
  ssr: boolean
  middleware: any[]
}
