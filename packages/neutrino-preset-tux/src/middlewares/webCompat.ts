import { Neutrino } from 'neutrino'
const LOCALS_LOADER = require.resolve('css-loader/locals')

export default ({ config }: Neutrino) => {
  // Disable dev server.
  config.devServer.clear()

  // Remove browser entry point.
  config.entryPoints.delete('index')

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
    .delete('chunk')
    .delete('html')
    .delete('hot')
    .delete('copy')
    .delete('minify')
    .delete('manifest')
    .delete('extract-css')
}

function fixFileLoader(options: any) {
  return {
    ...options,
    emitFile: false,
  }
}
