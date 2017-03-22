declare module 'css-loader/locals'
declare module 'extract-text-webpack-plugin'
declare module 'neutrino-middleware-banner'
declare module 'neutrino-middleware-chunk'
declare module 'neutrino-middleware-clean'
declare module 'neutrino-middleware-compile-loader'
declare module 'neutrino-middleware-copy'
declare module 'neutrino-middleware-env'
declare module 'neutrino-middleware-font-loader'
declare module 'neutrino-middleware-hot'
declare module 'neutrino-middleware-html-loader'
declare module 'neutrino-middleware-image-loader'
declare module 'neutrino-middleware-loader-merge'
declare module 'neutrino-middleware-minify'
declare module 'neutrino-middleware-named-modules'
declare module 'neutrino-middleware-start-server'
declare module 'neutrino-middleware-style-loader'
declare module 'neutrino-preset-react'
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
