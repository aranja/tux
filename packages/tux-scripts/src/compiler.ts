import { Neutrino, Middleware } from 'neutrino'
import tuxStaticPreset from 'neutrino-preset-tux'
import tuxSsrPreset from 'neutrino-preset-tux/server'
import optional from 'optional'
import { pathOr } from 'ramda'
import { join, resolve } from 'path'
import { Options } from './options'

type Command = 'inspect' | 'build' | 'start'

export async function run(command: Command, args: Options) {
  const options = await getOptions(args)
  const builders = []

  builders.push(runNeutrino(command, tuxStaticPreset, options))
  if (args.ssr) {
    builders.push(runNeutrino(command, tuxSsrPreset, options))
  }

  return Promise.all(builders)
}

async function runNeutrino(command: Command, middleware: Middleware, options: any) {
  const neutrino = new Neutrino(options.neutrinoOptions)

  neutrino.use(middleware)

  if (options.use) {
    await neutrino.requiresAndUses(options.use).promise()
  }

  const result = await neutrino.run(command)
      .promise()
      .catch(err => { throw err[0] })

  return result
}

async function getOptions(options: Options) {
  const { host, port, admin } = options
  const cwd = process.cwd()
  const pkg = optional(join(cwd, 'package.json')) || {}
  let document = pathOr(null, ['tux', 'document'], pkg)
  if (document) {
    document = resolve(document)
  }

  return {
    use: pathOr([], ['neutrino', 'use'], pkg).concat(options.use),
    neutrinoOptions: {
      tux: {
        admin,
      },
      html: {
        document,
      },
      config: {
        devServer: {
          host,
          port,
        },
      },
    }
  }
}
