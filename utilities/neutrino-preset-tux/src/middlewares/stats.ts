import { Neutrino } from 'neutrino'
import { StatsWriterPlugin } from 'webpack-stats-plugin'

export default (neutrino: Neutrino) => {
  // Only write stats files during build. Dev server automatically
  // has access to stats.
  neutrino.on('prebuild', () =>
    neutrino.config.plugin('stats').use(StatsWriterPlugin, [
      {
        fields: ['assetsByChunkName', 'chunks', 'publicPath', 'hash'],
      },
    ])
  )
}
