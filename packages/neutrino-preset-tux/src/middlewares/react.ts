import { Neutrino } from 'neutrino'
import loaderMerge from 'neutrino-middleware-loader-merge'
import { join } from 'path'

const MODULES = join(__dirname, 'node_modules')

export default (neutrino: Neutrino) => {
  const { config } = neutrino

  neutrino.use(loaderMerge('compile', 'babel'), {
    presets: [require.resolve('babel-preset-react')],
    plugins: [require.resolve('babel-plugin-transform-object-rest-spread')],
    env: {
      development: {
        plugins: [require.resolve('react-hot-loader/babel')],
      },
    },
  })

  config.resolve.extensions.add('.jsx')
  config.resolve.alias.set('react-native', 'react-native-web')
  config.externals({
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  })

  if (process.env.NODE_ENV === 'development') {
    config.entry('index').prepend(require.resolve('react-hot-loader/patch'))
  }

  if (config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      plugins: ['react'],
      baseConfig: {
        extends: ['plugin:react/recommended'],
      },
      parserOptions: {
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
        },
      },
      rules: {
        'react/prop-types': ['off'],
        'jsx-quotes': ['error', 'prefer-double'],
        'class-methods-use-this': [
          'error',
          {
            exceptMethods: [
              'render',
              'getInitialState',
              'getDefaultProps',
              'getChildContext',
              'componentWillMount',
              'componentDidMount',
              'componentWillReceiveProps',
              'shouldComponentUpdate',
              'componentWillUpdate',
              'componentDidUpdate',
              'componentWillUnmount',
            ],
          },
        ],
      },
    })
  }
}
