import react from 'neutrino-preset-react'
import JsxHtmlPlugin from 'jsx-html-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import { INDEX, CLIENT_BUILD, MODULES, ASSET_MANIFEST, HTML } from './paths'

export default (neutrino: any) => {
  react(neutrino)

  // Resolve dependencies here.
  const { config } = neutrino
  config.resolve.modules
    .add(MODULES)
    .prepend('node_modules')
  config.resolveLoader.modules.add(MODULES)

  config.output
    .path(CLIENT_BUILD)

  // Use react-app babel preset.
  config.module
    .rule('compile')
    .loader('babel', () => ({
      options: {
        presets: [require.resolve('babel-preset-react-app')],
      }
    }))

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
      babel: {
        babelrc: false,
        presets: [
          [require.resolve('babel-preset-react-app')],
        ],
      },
      manifestFileName: ASSET_MANIFEST,
      template: HTML,
    })
}
