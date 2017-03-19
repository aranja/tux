import Neutrino from 'neutrino'
import JsxHtmlPlugin from 'jsx-html-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import { NamedModulesPlugin } from 'webpack'
import shared from './shared'
import extractCss from './extractCss'
import { CLIENT_BUILD, ASSET_MANIFEST, HTML } from './paths'

export default (neutrino: Neutrino) => {
  const { config } = neutrino

  // Build into a subfolder so server.js can live outside it.
  neutrino.options.output = CLIENT_BUILD

  // Extend shared config.
  neutrino.use(shared)

  // Generate a manifest file which contains a mapping of all asset filenames
  // to their corresponding output file so that tools can pick it up without
  // having to parse `index.html`.
  config
    .plugin('manifest')
    .use(ManifestPlugin, [{
      fileName: ASSET_MANIFEST,
    }])

  // Create a html template using a react component.
  config.plugins.delete('html')
  config
    .plugin('html')
    .use(JsxHtmlPlugin, [{
      manifestFileName: ASSET_MANIFEST,
      template: HTML,
    }])

  if (process.env.NODE_ENV !== 'development') {
    // Minimize css with source maps.
    const styleRule = config.module
      .rule('style')
        .use('css')
          .tap((options: any) => ({
            ...options,
            sourceMap: true,
            minimize: true,
          }))

    neutrino.use(extractCss)
  }
}
