import { Neutrino } from 'neutrino'
import merge from 'lodash/merge'
import { SERVER_MAIN } from './paths'
import { node, react, env, web, webCompat } from './middlewares'

export default (neutrino: Neutrino) => {
  merge(neutrino.options, {
    appEntry: SERVER_MAIN,
  })

  // Configure webpack.
  neutrino.use(web)
  neutrino.use(webCompat)
  neutrino.use(node)
  neutrino.use(react)
  neutrino.use(env, 'server')
}
