export interface Args {
  options: {
    devServer?: {
      https?: boolean
      port?: number
      host?: string
    }
    tux?: {
      admin?: boolean
    }
    env?: {
      [key: string]: string
    }
  }
  ssr: boolean
  middleware: any[]
}
