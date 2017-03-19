import Neutrino from 'neutrino'
import env from 'neutrino-middleware-env'
import react from 'neutrino-preset-react'
import { MODULES } from './paths'

export default (neutrino: Neutrino) => {
  const { config } = neutrino

  // Extend react preset.
  neutrino.use(react)

  // Add environment variables to bundle.
  if (!process.env.hasOwnProperty('ADMIN')) {
    process.env.ADMIN = process.env.NODE_ENV !== 'production' ? 'true' : ''
  }
  process.env.SERVER = process.env.SERVER || ''
  neutrino.use(env, ['ADMIN', 'SERVER', ...getTuxEnv()])

  // Resolve dependencies here.
  config.resolve.modules.add(MODULES).prepend('node_modules')
  config.resolveLoader.modules.add(MODULES)

  // Prioritize `source.admin.js` over `source.js` in admin builds.
  if (process.env.ADMIN) {
    neutrino.use(adminExtension)
  }
}

function getTuxEnv() {
  return Object.keys(process.env).filter(key => key.startsWith('TUX_'))
}

function adminExtension(neutrino: Neutrino) {
  const { config } = neutrino
  const extensions = config.resolve.extensions.values()
  const index = extensions.indexOf('.js')
  if (index === -1) {
    throw new Error('Expected finding `.js` extension in webpack config')
  }
  extensions.splice(index, 0, '.admin.js')
  config.resolve.extensions.clear().merge(extensions)
}
