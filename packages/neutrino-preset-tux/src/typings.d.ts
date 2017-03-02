declare module 'neutrino-preset-react'

declare module 'jsx-html-webpack-plugin' {
  import { Plugin } from 'webpack'
  class JsxHtmlWebpackPlugin extends Plugin {
    constructor(options: any)
  }

  export default JsxHtmlWebpackPlugin
}

declare module 'webpack-manifest-plugin' {
  import { Plugin } from 'webpack'
  class WebpackManifestPlugin extends Plugin {
    constructor(options: any)
  }

  export default WebpackManifestPlugin
}

declare module 'css-loader/locals'
