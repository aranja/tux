import { serve, buildAssets } from 'tux'
import { join } from 'path'
import Document from 'react-document'

/*
 * Defined with Webpack in 'neutrino-preset-tux' and is the starting point
 * of the application, eg 'src/app.js'.
 */
// tslint:disable variable-name no-var-requires
const app = require(__appEntry)

export default ({ clientStats }: any) => {
  return serve({
    Document,
    assets: buildAssets(clientStats),
    app: app.__esModule ? app.default : app,
  })
}
