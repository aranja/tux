import path from 'path'

export const CWD = process.cwd()
export const BUILD = path.join(CWD, 'build')
export const SRC = path.join(CWD, 'src')
export const INDEX = path.join(SRC, 'index.js')
export const CLIENT_BUILD = path.join(BUILD, 'static')
export const SERVER = path.join(SRC, 'server.js')
export const SERVER_BUILD = BUILD
export const HTML = path.join(SRC, 'Html.js')
export const MODULES = path.join(__dirname, '../node_modules')
export const ASSET_MANIFEST = 'asset-manifest.json'
export const ASSET_MANIFEST_EXTERNAL =
  `./${path.relative(SERVER_BUILD, path.join(CLIENT_BUILD, ASSET_MANIFEST))}`
export const LOCALS_LOADER = require.resolve('css-loader/locals')
