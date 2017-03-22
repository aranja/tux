import { Neutrino } from 'neutrino'
import { web, react, env } from './middlewares'

export default (neutrino: Neutrino) => {
  neutrino.use(web)
  neutrino.use(react)
  neutrino.use(env, 'browser')
}
