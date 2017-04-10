import { Neutrino } from 'neutrino'
import env from 'neutrino-middleware-env'
import { DefinePlugin } from 'webpack'

export default (neutrino: Neutrino, target: string) => {
  // Add environment variables to bundle.
  if (!process.env.hasOwnProperty('ADMIN')) {
    process.env.ADMIN = process.env.NODE_ENV !== 'production' ? 'true' : ''
  }
  neutrino.use(env, ['ADMIN', ...getTuxEnv()])
  neutrino.use(targetEnv, target)

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

function targetEnv({ config }: Neutrino, target: string) {
  config.plugin('target-env')
    .use(DefinePlugin, [{
      [`process.env.SERVER`]: target === 'server' ? '"true"' : '""',
      [`process.env.BROWSER`]: target === 'browser' ? '"true"' : '""',
    }])
}
