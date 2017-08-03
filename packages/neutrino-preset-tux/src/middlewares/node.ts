import { Neutrino } from 'neutrino'
import banner from 'neutrino-middleware-banner'
import compile from 'neutrino-middleware-compile-loader'
import clean from 'neutrino-middleware-clean'
import loaderMerge from 'neutrino-middleware-loader-merge'
import hot from 'neutrino-middleware-hot'
import namedModules from 'neutrino-middleware-named-modules'
import nodeExternals from 'webpack-node-externals'
import { join } from 'path'
import { path } from 'ramda'

const MODULES = join(__dirname, '..', '..', 'node_modules')

export default (neutrino: Neutrino) => {
  const { config } = neutrino
  let pkg: any = {}

  /* eslint-disable global-require, no-empty */
  try {
    pkg = require(join(neutrino.options.root, 'package.json'))
  } catch (ex) {}
  /* eslint-enable global-require no-empty */

  if (!path(['options', 'compile', 'targets', 'node'], neutrino)) {
    Object.assign(neutrino.options, {
      compile: {
        targets: {
          node: '6.9',
        }
      }
    })
  }

  neutrino.use(namedModules)
  neutrino.use(compile, {
    include: [neutrino.options.source, neutrino.options.tests],
    babel: {
      plugins: [require.resolve('babel-plugin-dynamic-import-node')],
      presets: [
        [require.resolve('babel-preset-env'), {
          modules: false,
          targets: neutrino.options.compile.targets
        }]
      ]
    }
  })

  config.performance.hints(false)
  config
    .target('node')
    .node
      .set('__filename', false)
      .set('__dirname', false)
      .end()
    .devtool('source-map')
    .externals([nodeExternals({ whitelist: [/^webpack/, /tux/] })])
    .context(neutrino.options.root)
    .entry('app')
      .add(neutrino.options.appEntry)
      .end()
    .output
      .path(join(neutrino.options.output, 'ssr'))
      .filename('[name].js')
      .libraryTarget('commonjs2')
      .chunkFilename('[id].[hash:5]-[chunkhash:7].js')
      .end()
    .resolve
      .modules
        .add('node_modules')
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .end()
      .extensions
        .add('.js')
        .add('.json')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(neutrino.options.node_modules)
        .add(MODULES)

  // Build custom document component.
  const { html } = neutrino.options
  if (html && html.document) {
    config.entry('document')
      .add(html.document)
  }

  const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
    (pkg.devDependencies && 'source-map-support' in pkg.devDependencies)

  if (hasSourceMap) {
    neutrino.use(banner)
  }

  if (process.env.NODE_ENV !== 'development') {
    neutrino.use(clean, { paths: [neutrino.options.output] })
  } else {
    config.devtool('inline-source-map')
    config.entry('index').add('webpack/hot/poll?1000')
    config.output.devtoolModuleFilenameTemplate('[absolute-resource-path]')
    neutrino.use(hot)
  }

  if (config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      envs: ['node'],
      rules: {
        // enforce return after a callback
        'callback-return': 'off',

        // require all requires be top-level
        // http://eslint.org/docs/rules/global-require
        'global-require': 'error',

        // enforces error handling in callbacks (node environment)
        'handle-callback-err': 'off',

        // Allow console in Node.js
        'no-console': 'off',

        // disallow mixing regular variable and require declarations
        'no-mixed-requires': ['off', false],

        // disallow use of new operator with the require function
        'no-new-require': 'error',

        // disallow string concatenation with __dirname and __filename
        // http://eslint.org/docs/rules/no-path-concat
        'no-path-concat': 'error',

        // disallow use of process.env
        'no-process-env': 'off',

        // disallow process.exit()
        'no-process-exit': 'off',

        // restrict usage of specified node modules
        'no-restricted-modules': 'off',

        // disallow use of synchronous methods (off by default)
        'no-sync': 'off'
      }
    })
  }
}
