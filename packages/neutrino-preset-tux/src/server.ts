import path from 'path'
import webpack from 'webpack'
import tux from './index'
import { SERVER, SERVER_BUILD, ASSET_MANIFEST_EXTERNAL } from './paths'
import fixRulesForServer from './fixRulesForServer'

export default (neutrino: any) => {
  tux(neutrino)

  const { config } = neutrino

  config
    .target('node')
    .node
      .clear()
      .set('__filename', false)
      .set('__dirname', false)

  // Switch to a new entry point.
  config.entries.delete('index')
  config.entry('server')
    .add(SERVER)

  // Simpler bundle name (server.js).
  config.output
    .path(SERVER_BUILD)
    .filename('[name].js')
    .libraryTarget('commonjs2')
    .end()

  // Tweak module rules to work on server.
  fixRulesForServer(config.module.rules)

  // Map `import assets from 'asset-manifest'` to asset-manifest.json from client build.
  config.externals([
    { 'asset-manifest': ASSET_MANIFEST_EXTERNAL },
  ])

  // Disable plugins which are not useful in node.js.
  config.plugins
    .delete('env')
    .delete('chunk')
    .delete('html')
    .delete('hot')
    .delete('copy')
    .delete('clean')
    .delete('minify')
    .delete('manifest')

  // Add source map support for stack traces.
  config
    .plugin('banner')
    .use(webpack.BannerPlugin, {
      banner: `require('${require.resolve('source-map-support')}').install();`,
      raw: true,
      entryOnly: true,
    })

  // Disable dev server. This causes neutrino to run `build` instead of `start` for node targets.
  config.devServer.clear()

  // Disable bundle size analyzing.
  config.options.set('performance', { hints: false })
}
