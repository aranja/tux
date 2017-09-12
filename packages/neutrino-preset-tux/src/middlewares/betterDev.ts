import { Neutrino } from 'neutrino'
import path from 'path'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import { removeEntryPoints } from '../utils'
import { Options } from '../Options'

export default ({ config }: Neutrino, options: Options) => {
  // Add better error handling from react-dev-utils
  config.entry('index').when(options.hot, entry => {
    removeEntryPoints(entry, /dev-server/)
    entry.prepend(require.resolve('react-dev-utils/webpackHotDevClient'))
  })

  // Support opening files from the runtime error overlay.
  config.devServer.setup(app => {
    app.use(errorOverlayMiddleware())
  })

  // Point sourcemap entries to original disk location (format as URL on Windows)
  config.output.devtoolModuleFilenameTemplate((info: any) =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  )
}
