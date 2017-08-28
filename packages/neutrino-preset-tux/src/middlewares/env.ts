import { Neutrino } from 'neutrino'
import env from 'neutrino-middleware-env'
import { DefinePlugin } from 'webpack'

export default (neutrino: Neutrino, options: any) => {
  // Add environment variables to bundle.
  process.env.ADMIN = options.tux.admin ? 'true' : ''
  neutrino.use(env, ['ADMIN', ...getTuxEnv()])
  neutrino.use(targetEnv, neutrino.options.target)

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
  config.plugin('target-env').use(DefinePlugin, [
    {
      [`process.env.SERVER`]: target === 'server' ? '"true"' : '""',
      [`process.env.BROWSER`]: target !== 'server' ? '"true"' : '""',
    },
  ])
}
