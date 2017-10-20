import { Neutrino } from 'neutrino'
import env from 'neutrino-middleware-env'
import { DefinePlugin } from 'webpack'

export default (neutrino: Neutrino) => {
  // Add environment variables to bundle.
  neutrino.use(env, getTuxEnv())

  neutrino.use(targetEnv, neutrino.options.target)

  neutrino.use(appEntryConstant, neutrino.options.appEntry)
}

function getTuxEnv() {
  return Object.keys(process.env).filter(key => key.startsWith('TUX_'))
}

function appEntryConstant({ config }: Neutrino, appEntry: string) {
  config
    .plugin('app-entry-constant')
    .use(DefinePlugin, [{ __appEntry: JSON.stringify(appEntry) }])
}

function targetEnv({ config }: Neutrino, target: string) {
  config.plugin('target-env').use(DefinePlugin, [
    {
      ['process.env.TUX_BUILD_TARGET']: JSON.stringify(target),
    },
  ])
}
