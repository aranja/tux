import { serve } from 'tux'
import Document from 'react-document'

/*
 * Defined with Webpack in 'neutrino-preset-tux' and is the starting point
 * of the application, eg 'src/app.js'.
 */
// tslint:disable variable-name no-var-requires
const app = require(__appEntry)

export default stats => {
  return serve({
    assets: {},
    app: app.__esModule ? app.default : app,
    Document,
  })
}
