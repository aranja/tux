import { start } from 'tux'

/*
 * global __appEntry
 *
 * Defined with Webpack in 'neutrino-preset-tux' and is the starting point
 * of the application, eg 'src/app.js'.
 */
start(require(__appEntry).default)
