export interface Options {
  devServer: {
    quiet: boolean
    noInfo: boolean
    port: number
    https: boolean
    open: boolean
    stats: object
    host?: string
    public?: string
  }
  hot: boolean
  polyfills: {
    async: boolean
  }
  html: {}
}
