import { start } from 'tux'

/*
 * Defined with Webpack in 'neutrino-preset-tux' and is the starting point
 * of the application, eg 'src/app.js'.
 */
// tslint:disable variable-name no-var-requires
declare global {
  const __appEntry: string
}
const app = require(__appEntry)
start(app.__esModule ? app.default : app)
