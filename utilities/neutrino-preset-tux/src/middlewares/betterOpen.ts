import { Neutrino } from 'neutrino'
import merge from 'deepmerge'
import openBrowser from 'react-dev-utils/openBrowser'
import { Options } from '../Options'

const isLocal = (host: string) => host === 'localhost' || host === '127.0.0.1'

const getPublic = (neutrino: Neutrino, { devServer: options }: Options) => {
  if (options.public) {
    return options.public
  }

  if (neutrino.options.host) {
    return isLocal(neutrino.options.host) ? 'localhost' : neutrino.options.host
  }

  return !options.host || isLocal(options.host) ? 'localhost' : options.host
}

export default (neutrino: Neutrino, opts: Options) => {
  const options = merge.all<any>([
    {
      port: 5000,
      https: false,
    },
    opts.devServer,
    neutrino.options.port ? { port: neutrino.options.port } : {},
    neutrino.options.https ? { https: neutrino.options.https } : {},
  ])
  const publicHost = getPublic(neutrino, opts)
  const protocol = options.https ? 'https' : 'http'
  const url = `${protocol}://${publicHost}:${options.port}`
  neutrino.on('start', () => openBrowser(url))
}
