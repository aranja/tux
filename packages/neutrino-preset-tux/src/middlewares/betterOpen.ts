import { Neutrino } from 'neutrino'
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
  const publicHost = getPublic(neutrino, opts)
  const protocol = opts.devServer.https ? 'https' : 'http'
  const url = `${protocol}://${publicHost}:${opts.devServer.port}`
  neutrino.on('start', () => openBrowser(url))
}
