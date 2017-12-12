import { Neutrino } from 'neutrino'
const LOCALS_LOADER = require.resolve('css-loader/locals')

export default ({ config }: Neutrino) => {
  // Disable dev server.
  config.devServer.clear()

  // Remove all entry points. We'll add SSR entry point manually.
  config.entryPoints.clear()

  // Disable style, url and file loaders.
  const rules = config.module.rules
  rules.values().forEach(rule => {
    if (rule.uses.has('css')) {
      rule.use('css').loader(LOCALS_LOADER)
      rule.uses.delete('style').delete('extract-css')
    }
    if (rule.uses.has('url')) {
      rule.use('url').tap(fixFileLoader)
    }
    if (rule.uses.has('file')) {
      rule.use('file').tap(fixFileLoader)
    }
  })

  // Disable plugins which are not useful in node.js.
  config.plugins
    .delete('vendor-chunk')
    .delete('runtime-chunk')
    .delete('copy')
    .delete('minify')
    .delete('manifest')

  // HTML template plugins, one for each main.
  Object.keys(config.plugins.entries())
    .filter(plugin => plugin.startsWith('html-'))
    .forEach(plugin => config.plugins.delete(plugin))
}

function fixFileLoader(options: any) {
  return {
    ...options,
    emitFile: false,
  }
}
