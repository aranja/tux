import { Neutrino } from 'neutrino'
import merge from 'deepmerge'
import react from 'neutrino-preset-react'
import {
  env,
  ssr,
  betterOpen,
  extractStyle,
  html,
  minifyStyle,
} from './middlewares'
import { removeEntryPoints } from './utils'
import { Options } from './Options'

export default (neutrino: Neutrino, opts: Partial<Options> = {}) => {
  const options = merge<Options>(
    {
      devServer: {
        quiet: neutrino.options.quiet,
        noInfo: neutrino.options.quiet,
        port: 5000,
        https: false,
        open: true,
        stats: {
          errorDetails: false,
        },
      },
      hot: true,
      polyfills: {
        async: true,
      },
      tux: {
        admin: process.env.NODE_ENV !== 'production',
      },
      html: {},
    },
    opts as Options
  )
  neutrino.options.target = neutrino.options.target || 'browser'

  neutrino.use(react, merge<any>(options, { devServer: { open: false } }))
  neutrino.use(html, options.html)
  neutrino.use(env, options)

  neutrino.config
    .when(options.devServer.open, () => neutrino.use(betterOpen, options))
    .when(
      process.env.NODE_ENV === 'production',
      () => {
        neutrino.use(extractStyle)
        neutrino.use(minifyStyle)
      },
      config => {
        config
          .entry('index')
          .prepend(require.resolve('react-error-overlay'))
          .when(options.hot, entry => {
            removeEntryPoints(entry, /dev-server/)
            entry.prepend(
              require.resolve('react-dev-utils/webpackHotDevClient')
            )
          })
      }
    )
    .when(neutrino.options.target === 'server', () =>
      neutrino.use(ssr, options)
    )
}
