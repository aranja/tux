import { Neutrino } from 'neutrino'
import merge from 'deepmerge'
import react from 'neutrino-preset-react'
import {
  env,
  ssr,
  betterOpen,
  betterDev,
  extractStyle,
  html,
  minifyStyle,
} from './middlewares'
import { Options } from './Options'

export default (neutrino: Neutrino, opts: Partial<Options> = {}) => {
  const isProd = process.env.NODE_ENV === 'production'
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
      html: {},
    },
    opts as Options
  )

  // This preset depends on a target option, let's give it a default.
  neutrino.options.target = neutrino.options.target || 'browser'
  const isServer = neutrino.options.target === 'server'

  // Replace entry based on target.
  neutrino.options.appEntry = neutrino.options.entry
  neutrino.options.entry = isServer
    ? neutrino.options.serverEntry
    : neutrino.options.browserEntry

  // Build on top of the offical react preset (overriding open functionality).
  neutrino.use(react, merge<any>(options, { devServer: { open: false } }))

  // Switch to custom html plugin.
  neutrino.use(html, options.html)

  // Add more environment variables.
  neutrino.use(env, options)

  // prettier-ignore
  neutrino.config
    // Webpack Hot Server Middleware expects your Webpack config to be named.
    .set('name', 'client')
  
    // Neutrino defaults to relative paths './'. Tux is optimized for SPAs, where absolute paths
    // are a better default.
    .output
      .publicPath('/')
      .end()

    // Fix svg imports: https://github.com/mozilla-neutrino/neutrino-dev/issues/272
    .module
      .rule('svg')
        .use('url')
          .loader(require.resolve('file-loader'))
          .options({ limit: 8192 })
          .end()
        .end()
      .end()

    // Use a better open utility.
    .when(options.devServer.open, () => neutrino.use(betterOpen, options))

    // Extract and minify css in production.
    .when(isProd, () => {
      neutrino.use(extractStyle)
      neutrino.use(minifyStyle)
    })

    // Add goodies from create-react-app project.
    .when(!isProd, () => {
      neutrino.use(betterDev, options)
    })

  // Wait until all presets and middlewares have run before
  // adapting the config for SSR.
  if (isServer) {
    neutrino.on('prerun', () => neutrino.use(ssr, options))
  }
}
