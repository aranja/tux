export interface Options {
  devServer: {
    quiet: boolean
    noInfo: boolean
    port: number
    https: boolean
    open: boolean
    stats: Object
    host?: string
    public?: string
  }
  hot: boolean
  polyfills: {
    async: boolean
  }
  tux: {
    admin: boolean
  }
  html: {}
}
