import { Neutrino, build, test, inspect } from 'neutrino'
import merge from 'deepmerge'
import { pathOr } from 'ramda'
import webpack, { Compiler } from 'webpack'
import { Args, Options } from './options'

type Command = 'inspect' | 'build' | 'start' | 'test'
type Target = 'browser' | 'server'

const createBuilder = (commandName: Command) => async (api: Neutrino) => {
  // Trigger all pre-events for the current command
  await api.emitForAll(`pre${commandName}`, api.options.args)
  // Trigger generic pre-event
  await api.emitForAll(`prerun`, api.options.args)
  // Extract webpack config
  return api.config.toConfig()
}

export async function run(commandName: Command, args: Args) {
  const buildConfig = createBuilder(commandName)
  const apis = createNeutrinoApis(commandName, [
    getOptions(args, 'browser'),
    getOptions(args, 'server'),
  ])

  // Require and use all middleware for both apis
  apis.map(api => {
    args.middleware.forEach(middleware => api.use(middleware))
  })

  // Generate webpack configuration array
  const configs = await Promise.all(apis.map(buildConfig))

  // Create a webpack compiler instance
  const compiler = webpack(configs)

  // Trigger all post events
  await Promise.all(
    [].concat(
      apis.map(api => [
        api.emitForAll(commandName, api.options.args),
        api.emitForAll('run', api.options.args),
      ])
    )
  )

  return compiler
}

function createNeutrinoApis(command: Command, targets: Options[]) {
  return targets.map(options => {
    const api = new Neutrino(options)

    api.register('build', build)
    api.register('inspect', inspect)
    api.register('test', test)

    return api
  })
}

function getOptions(args: Args, target: Target) {
  return merge<Options>(
    {
      target,
      browserEntry: require.resolve('./entry-points/browser'),
      serverEntry: require.resolve('./entry-points/server'),
      entry: 'app',
      output: target === 'browser' ? 'build/static' : 'build/ssr',
      port: 5000,
      quiet: true,
    },
    args.options
  )
}
