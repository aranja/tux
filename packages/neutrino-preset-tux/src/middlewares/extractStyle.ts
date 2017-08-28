import { Neutrino } from 'neutrino'
import { Rule } from 'webpack-chain'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { prependUse } from '../utils'

export default function extractCss(neutrino: Neutrino) {
  const { config } = neutrino

  // Prepend extract text loader before style loader. Configure it
  // to "omit" the next (1) loader when extracting text.
  prependUse(config.module.rule('style'), rule =>
    rule
      .use('extract-css')
      .loader(require.resolve('extract-text-webpack-plugin/loader'))
      .options({
        omit: 1,
        remove: true,
      })
  )

  // Add plugin to save extracted css.
  config.plugin('extract-css').use(ExtractTextPlugin, [
    {
      filename: '[name].[chunkhash].bundle.css',
    },
  ])
}
