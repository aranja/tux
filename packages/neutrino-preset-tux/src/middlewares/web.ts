import { Neutrino } from 'neutrino'
import htmlLoader from 'neutrino-middleware-html-loader'
import styleLoader from 'neutrino-middleware-style-loader'
import extractStyle from './extractStyle'
import minifyStyle from './minifyStyle'
import fontLoader from 'neutrino-middleware-font-loader'
import imageLoader from 'neutrino-middleware-image-loader'
import compileLoader from 'neutrino-middleware-compile-loader'
import htmlTemplate from './html'
import chunk from 'neutrino-middleware-chunk'
import hot from 'neutrino-middleware-hot'
import copy from 'neutrino-middleware-copy'
import clean from 'neutrino-middleware-clean'
import minify from 'neutrino-middleware-minify'
import loaderMerge from 'neutrino-middleware-loader-merge'
import namedModules from 'neutrino-middleware-named-modules'
import { join } from 'path'
import { path, pathOr } from 'ramda'

const MODULES = join(__dirname, '..', '..', 'node_modules')

function devServer({ config }: Neutrino, options: any) {
  config.devServer
    .host(options.host)
    .port(parseInt(options.port, 10))
    .https(options.https)
    .contentBase(options.contentBase)
    .historyApiFallback(true)
    .hot(true)
    .stats({
      assets: false,
      children: false,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: false,
      modules: false,
      publicPath: false,
      timings: false,
      version: false,
      warnings: true
    })
}

export default (neutrino: Neutrino) => {
  const { config } = neutrino

  if (!path(['options', 'compile', 'targets', 'browsers'], neutrino)) {
    Object.assign(neutrino.options, {
      compile: {
        targets: {
          browsers: [
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Edge versions',
            'last 2 Opera versions',
            'last 2 Safari versions',
            'last 2 iOS versions'
          ]
        }
      }
    })
  }

  neutrino.use(htmlLoader)
  neutrino.use(styleLoader)
  neutrino.use(fontLoader)
  neutrino.use(imageLoader)
  neutrino.use(htmlTemplate, neutrino.options.html)
  neutrino.use(namedModules)
  neutrino.use(compileLoader, {
    include: [neutrino.options.source, neutrino.options.tests],
    babel: {
      plugins: [require.resolve('babel-plugin-syntax-dynamic-import')],
      presets: [
        [require.resolve('babel-preset-env'), {
          modules: false,
          useBuiltIns: true,
          include: ['transform-regenerator'],
          targets: neutrino.options.compile.targets
        }]
      ]
    }
  })

  if (process.env.NODE_ENV !== 'test') {
    neutrino.use(chunk)
  }

  config
    .target('web')
    .context(neutrino.options.root)
    .entry('index')
    .add(require.resolve('babel-polyfill'))
    .add(neutrino.options.entry)

  config.output
    .path(join(neutrino.options.output, 'static'))
    .publicPath('/')
    .filename('[name].bundle.js')
    .chunkFilename('[id].[chunkhash].js')

  config.resolve.modules.add('node_modules').add(neutrino.options.node_modules).add(MODULES)
  config.resolve.extensions.add('.js').add('.json')
  config.resolveLoader.modules.add(neutrino.options.node_modules).add(MODULES)

  config.node
    .set('console', false)
    .set('global', true)
    .set('process', true)
    .set('Buffer', true)
    .set('__filename', 'mock')
    .set('__dirname', 'mock')
    .set('setImmediate', true)
    .set('fs', 'empty')
    .set('tls', 'empty')

  if (config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      globals: ['Buffer'],
      envs: ['browser', 'commonjs']
    })
  }

  if (process.env.NODE_ENV === 'development') {
    const protocol = process.env.HTTPS ? 'https' : 'http'
    const host = process.env.HOST ||
      pathOr('localhost', ['options', 'config', 'devServer', 'host'], neutrino)
    const port = process.env.PORT ||
      pathOr(5000, ['options', 'config', 'devServer', 'port'], neutrino)

    neutrino.use(hot)
    neutrino.use(devServer, {
      host,
      port,
      https: pathOr(protocol === 'https', ['options', 'config', 'devServer', 'https'], neutrino),
      contentBase: neutrino.options.source
    })

    config
      .devtool('source-map')
      .entry('index')
      .add(`webpack-dev-server/client?${protocol}://${host}:${port}/`)
      .add('webpack/hot/dev-server')
  } else {
    neutrino.use(extractStyle)
    neutrino.use(minifyStyle)
    neutrino.use(clean, { paths: [neutrino.options.output] })
    neutrino.use(minify)
    neutrino.use(copy, {
      patterns: [{ context: neutrino.options.source, from: '**/*' }],
      options: { ignore: ['*.js*'] }
    })
    config.output.filename('[name].[chunkhash].bundle.js')
  }
}
