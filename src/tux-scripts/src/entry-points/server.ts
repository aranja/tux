import { serve } from 'tux'

/*
 * Defined with Webpack in 'neutrino-preset-tux' and is the starting point
 * of the application, eg 'src/app.js'.
 */
// tslint:disable variable-name no-var-requires
const app = require(__appEntry)

export default ({ clientStats, serverStats }) => {
  console.log('\nMiddleware\n')
  return (req, res, next) => {
    console.log('foooo')
    console.log('\nFoo bAt\n')
    res.json({ clientStats, serverStats })
  }
}
