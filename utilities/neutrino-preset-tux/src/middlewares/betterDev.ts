import { Neutrino } from 'neutrino'
import path from 'path'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import { removeEntryPoints } from '../utils'
import { Options } from '../Options'

export default (
  { config, options: { target } }: Neutrino,
  options: Options
) => {
  // Add better error handling from react-dev-utils
  config.entry('index').when(options.hot && target === 'browser', entry => {
    removeEntryPoints(entry, /dev-server/)
    entry.prepend(
      require.resolve('webpack-hot-middleware/client') + '?reload=true'
    )
  })

  // Point sourcemap entries to original disk location (format as URL on Windows)
  config.output.devtoolModuleFilenameTemplate((info: any) =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  )

  // If you require a missing module and then `npm install` it, you still have
  // to restart the development server for Webpack to discover it. This plugin
  // makes the discovery automatic so you don't have to restart.
  config.plugin('watch-node-modules').use(WatchMissingNodeModulesPlugin)
}
