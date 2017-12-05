import { Neutrino } from 'neutrino'
import banner from 'neutrino-middleware-banner'
import compile from 'neutrino-middleware-compile-loader'
import merge from 'deepmerge'
import nodeExternals from 'webpack-node-externals'
import { join, resolve } from 'path'
import { path } from 'ramda'
import webCompat from './webCompat'

const MODULES = join(__dirname, '..', '..', 'node_modules')
const getPackageJson = (root: string) => {
  try {
    return require(join(root, 'package.json')) // eslint-disable-line
  } catch (err) {
    return {}
  }
}

export default (neutrino: Neutrino, options: any = {}) => {
  const pkg = getPackageJson(neutrino.options.root)
  const sourceMap = !!(
    (pkg.dependencies && pkg.dependencies['source-map-support']) ||
    (pkg.devDependencies && pkg.devDependencies['source-map-support'])
  )

  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(existing =>
      compile.merge(existing, {
        plugins: [
          ...(options.polyfills.async
            ? [[require.resolve('fast-async'), { spec: true }]]
            : []),
          require.resolve('babel-plugin-dynamic-import-node'),
        ],
        presets: [
          [
            'babel-preset-env',
            {
              debug: neutrino.options.debug,
              targets: { node: '6.10' },
              modules: false,
              useBuiltIns: true,
              exclude: options.polyfills.async
                ? ['transform-regenerator', 'transform-async-to-generator']
                : [],
            },
          ],
        ],
      })
    )

  neutrino.use(webCompat)
  // prettier-ignore
  neutrino.config
    .when(options.html.document, config =>
      config
        .entry('document')
        .add(resolve(neutrino.options.root, options.html.document))
    )
    .when(sourceMap, () => neutrino.use(banner))
    .performance
      .hints(false)
      .end()
    .target('node')
    .node
      .clear()
      .set('__filename', false)
      .set('__dirname', false)
      .end()
    .devtool('source-map')
    .externals([nodeExternals({ whitelist: [/^webpack/, /tux/] })])
    .entry('app')
      .add(neutrino.options.entry)
      .end()
    .output
      .path(neutrino.options.output)
      .filename('[name].js')
      .libraryTarget('commonjs2')
      .chunkFilename('[id].[hash:5]-[chunkhash:7].js')
      .end()
    .when(neutrino.options.env.NODE_ENV === 'development', config => {
      config.devtool('inline-source-map');
    });
}
