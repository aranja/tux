import { Neutrino, test, inspect } from 'neutrino'
import merge from 'deepmerge'
import { pathOr } from 'ramda'
import webpack, { Compiler } from 'webpack'
import { start, build } from './webpack'
import { Args, Options, Target } from './options'

type Command = 'inspect' | 'build' | 'start' | 'test'

const multiCommands = {
  start,
  build,
}

const emitForAll = (apis: Neutrino[], eventName: string) =>
  Promise.all(apis.map(api => api.emitForAll(eventName, api.options.args)))

export async function run(commandName: Command, args: Args) {
  const target =
    args.target || (commandName in multiCommands ? 'multi' : 'browser')
  const apis = createNeutrinoApis(commandName, target, args)

  // Trigger all pre events
  await emitForAll(apis, `pre${commandName}`)
  await emitForAll(apis, 'prerun')

  // Prepare run command. Handle multi config here.
  const configs = apis.map(api => api.config.toConfig())
  const mainApi = apis[0]
  const config = target === 'multi' ? configs : configs[0]

  // Note: Always runs multi commands against browser Neutrino.
  if (!mainApi.commands[commandName]) {
    throw new Error(`Unknown command ${commandName}.`)
  }
  const result = mainApi.commands[commandName](config, mainApi)

  // Wait for the result.
  const promiseResult = await (result.promise
    ? result.promise()
    : Promise.resolve(result))

  // Trigger all post events.
  await emitForAll(apis, commandName)
  await emitForAll(apis, `run`)

  return promiseResult
}

function createNeutrinoApis(commandName: Command, target: Target, args: Args) {
  const apiOptions = []
  if (target === 'browser' || target === 'multi') {
    apiOptions.push(getOptions(commandName, args, 'browser'))
  }
  if (target === 'server' || target === 'multi') {
    apiOptions.push(getOptions(commandName, args, 'server'))
  }

  return apiOptions.map(options => {
    const api = Neutrino(options)

    // Register built in commands
    api.register('start', start)
    api.register('build', build)
    api.register('inspect', inspect)
    api.register('test', test)

    // Require and use all configured middlewares.
    args.middleware.forEach(middleware => api.use(middleware))

    return api
  })
}

function getOptions(command: Command, args: Args, target: Target) {
  return merge<Options>(
    {
      target,
      command,
      browserEntry: require.resolve('./entry-points/browser'),
      serverEntry: require.resolve('./entry-points/server'),
      mains: { index: 'app' },
      output: target === 'browser' ? 'build/static' : 'build/ssr',
      quiet: true,
    },
    args.options
  )
}
