import { Neutrino } from 'neutrino'
import env from 'neutrino-middleware-env'
import { DefinePlugin } from 'webpack'

export default (neutrino: Neutrino) => {
  // Add environment variables to bundle.
  neutrino.use(env, getTuxEnv())

  neutrino.use(targetEnv, neutrino.options.target)
}

function getTuxEnv() {
  return Object.keys(process.env).filter(key => key.startsWith('TUX_'))
}

function targetEnv({ config }: Neutrino, target: string) {
  config.plugin('target-env').use(DefinePlugin, [
    {
      [`process.env.BUILD_TARGET`]: target,
    },
  ])
}
