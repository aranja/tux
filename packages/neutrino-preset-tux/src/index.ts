import react from 'neutrino-preset-react'
import JsxHtmlPlugin from 'jsx-html-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import { NamedModulesPlugin } from 'webpack'

import { INDEX, CLIENT_BUILD, MODULES, ASSET_MANIFEST, HTML } from './paths'

export default (neutrino: any) => {
  react(neutrino)

  // Resolve dependencies here.
  const { config } = neutrino
  config.resolve.modules
    .add(MODULES)
    .prepend('node_modules')
  config.resolveLoader.modules.add(MODULES)

  // Build into a subfolder so server.js can live outside it.
  config.output
    .path(CLIENT_BUILD)
  if (config.plugins.has('clean')) {
    config.plugin('clean').args[0] = [CLIENT_BUILD]
  }

  // Generate a manifest file which contains a mapping of all asset filenames
  // to their corresponding output file so that tools can pick it up without
  // having to parse `index.html`.
  config
    .plugin('manifest')
    .use(ManifestPlugin, {
      fileName: ASSET_MANIFEST,
    })

  // Create a html template using a react component.
  config.plugins.delete('html')
  config
    .plugin('html')
    .use(JsxHtmlPlugin, {
      manifestFileName: ASSET_MANIFEST,
      template: HTML,
    })

  if (process.env.NODE_ENV === 'development') {
    // Named modules in development to make hot reloads more readable.
    config.plugin('named-modules').use(NamedModulesPlugin)
  }
}
