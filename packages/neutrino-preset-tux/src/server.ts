import react from 'neutrino-preset-react'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { PKG, SERVER, MODULES, ASSET_MANIFEST_EXTERNAL } from './paths'
import fixRulesForServer from './fixRulesForServer'

const pkgConfig = require(PKG)

export default (neutrino: any) => {
  const { config } = neutrino

  // Extend react preset.
  neutrino.use(react)

  // Resolve dependencies here.
  config.resolve.modules.add(MODULES).prepend('node_modules')
  config.resolveLoader.modules.add(MODULES)

  const hasSourceMap =
    (pkgConfig.dependencies && 'source-map-support' in pkgConfig.dependencies) ||
    (pkgConfig.devDependencies && 'source-map-support' in pkgConfig.devDependencies)

  // Build for node.
  config
    .target('node')
    .node
      .clear()
      .set('__filename', false)
      .set('__dirname', false)

  // Always have good source maps.
  config.devtool('source-map')

  // Switch to a new entry point.
  config.entryPoints.delete('index')
  config.entry('server')
    .add(SERVER)

  // Simpler bundle name (server.js).
  config.output
    .filename('[name].js')
    .libraryTarget('commonjs2')
    .end()

  // Tweak module rules to work on server.
  neutrino.use(fixRulesForServer)

  // Map `import assets from 'asset-manifest'` to asset-manifest.json from client build.
  config.externals([
    nodeExternals(),
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
    .use(webpack.BannerPlugin, [{
      banner:
        (hasSourceMap ? `require('source-map-support').install();\n` : '') +
        `process.env.SERVER = 'true';\n`,
      raw: true,
      entryOnly: true
    }])

  // Disable dev server. This causes neutrino to run `build` instead of `start` for node targets.
  config.devServer.clear()

  // Disable bundle size analyzing.
  config.performance.hints(false)
}
