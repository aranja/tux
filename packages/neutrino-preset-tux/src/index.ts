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
  // This preset depends on a target option, let's give it a default.
  neutrino.options.target = neutrino.options.target || 'browser'

  // Build on top of the offical react preset (overriding open functionality).
  neutrino.use(react, merge<any>(options, { devServer: { open: false } }))

  // Switch to custom html plugin.
  neutrino.use(html, options.html)

  // Add more environment variables.
  neutrino.use(env, options)

  neutrino.config// Neutrino defaults to relative paths './'. Tux is optimized for SPAs, where apsolute paths
  // are a better default.
  .output
    .publicPath('/')
    // Use a better open utility.
    .when(options.devServer.open, () => neutrino.use(betterOpen, options))
    .when(
      process.env.NODE_ENV === 'production',
      // Extract and minify stylesheets in production.
      () => {
        neutrino.use(extractStyle)
        neutrino.use(minifyStyle)
      },
      // Add better error handling in development.
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

  // Wait until all presets and middlewares have run before
  // adapting the config for SSR.
  if (neutrino.options.target === 'server') {
    neutrino.on('prerun', () => neutrino.use(ssr, options))
  }
}
