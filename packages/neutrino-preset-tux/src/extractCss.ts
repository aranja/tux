import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default function extractCss(neutrino: any) {
  const { config } = neutrino
  const styleRule = config.module.rule('style')

  // We prepend the extract loader by clearing the uses and adding them back in order.
  // Clone existing uses.
  const existingUses = styleRule.uses.toConfig()

  styleRule
    // Clear uses
    .uses
      .clear()
      .end()
    // Add extract-css loader first.
    .use('extract-css')
      .loader(require.resolve('extract-text-webpack-plugin/loader'))
      .options({
        omit: 1,
        remove: true,
      })
      .end()
    // Then add existing uses again.
    .merge(existingUses)

  // Add plugin to save extracted css.
  config.plugin('extract-css')
    .use(ExtractTextPlugin, [{
      filename: '[name].[chunkhash].bundle.css',
    }])
}
