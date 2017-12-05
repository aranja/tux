import { Neutrino } from 'neutrino'
import merge from 'deepmerge'
import react from 'neutrino-preset-react'
import hot from 'neutrino-middleware-hot'
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
        https: neutrino.options.https,
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

  // Build on top of the offical react preset (overriding devServer and open functionality).
  // Skip react-hot-loader for now while enabling other HMR functionality.
  const reactOptions = merge<any>(options, {
    devServer: { open: false },
    hot: false,
  })
  neutrino.use(react, reactOptions)

  // Switch to custom html plugin.
  neutrino.use(html, options.html)

  // Add more environment variables.
  neutrino.use(env, options)

  // prettier-ignore
  neutrino.config
    // Webpack Hot Server Middleware expects a MultiConfiguration with "server" and "client" names.
    .set('name', isServer ? 'server' : 'client')

    // Remove devServer. We use webpack-dev-middleware
    .devServer.clear().end()

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
      neutrino.use(hot)
      neutrino.use(betterDev, options)
    })

  // Wait until all presets and middlewares have run before
  // adapting the config for SSR.
  if (isServer) {
    neutrino.on('prerun', () => neutrino.use(ssr, options))
  }
}
