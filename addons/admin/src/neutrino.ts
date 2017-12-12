import { Neutrino } from 'neutrino'

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

export default (neutrino: Neutrino) => {
  // Configure admin variable.
  if (process.env.ADMIN == null) {
    const { admin } = neutrino.options
    const buildAdmin =
      admin != null ? admin : process.env.NODE_ENV === 'development'
    process.env.ADMIN = buildAdmin ? 'true' : ''
  }

  // Add ADMIN environment variable to bundle.
  neutrino.config.plugin('env').tap(args => args.concat('ADMIN'))

  // Prioritize `source.admin.js` over `source.js` in admin builds.
  if (process.env.ADMIN) {
    neutrino.use(adminExtension)
  }
}
