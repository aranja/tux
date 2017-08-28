import { Neutrino, build, start, test, inspect } from 'neutrino'
import merge from 'deepmerge'
import { pathOr } from 'ramda'
import { Args } from './options'

type Command = 'inspect' | 'build' | 'start' | 'test'
type Target = 'browser' | 'server'

export function run(command: Command, args: Args) {
  const builders = []

  builders.push(runNeutrino(command, args, 'browser'))
  if (args.ssr) {
    builders.push(runNeutrino(command, args, 'server'))
  }

  return Promise.all(builders)
}

function runNeutrino(command: Command, args: Args, target: Target) {
  const neutrino = new Neutrino(getOptions(args, target))
  neutrino.register('build', build)
  neutrino.register('start', start)
  neutrino.register('test', test)
  neutrino.register('inspect', inspect)

  return neutrino.run(command, args.middleware).promise().catch(err => {
    throw err[0]
  })
}

function getOptions(args: Args, target: Target) {
  return merge<Object>(
    {
      entry: target === 'browser' ? 'index' : 'app',
      output: target === 'browser' ? 'build/static' : 'build/ssr',
      target: target,
      port: 5000,
      quiet: true,
    },
    args.options
  )
}
