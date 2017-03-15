import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default function extractCss(neutrino: any) {
  const { config } = neutrino

  // Prepend extract text loader before style loader.
  prependUse(config.module.rule('style'), (rule: any) =>
    rule.use('extract-css')
      .loader(require.resolve('extract-text-webpack-plugin/loader'))
      .options({
        omit: 1,
        remove: true,
      })
  )

  // Add plugin to save extracted css.
  config.plugin('extract-css')
    .use(ExtractTextPlugin, [{
      filename: '[name].[chunkhash].bundle.css',
    }])
}

// For loaders, the order matters. In this case we want to prepend
// a loader before existing loaders.
const prependUse = (rule: any, cb: any) => {
  const existingUses = rule.uses.entries()
  rule.uses.clear()
  cb(rule)
  rule.uses.merge(existingUses)
}
