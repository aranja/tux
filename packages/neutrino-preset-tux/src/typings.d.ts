declare module 'neutrino-preset-react'
declare module 'css-loader/locals'
declare module 'webpack-node-externals'


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
