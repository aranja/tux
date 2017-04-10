import path from 'path'

export const CWD = process.cwd()
export const BUILD = path.join(CWD, 'build')
export const SRC = path.join(CWD, 'src')
export const PKG = path.join(CWD, 'package.json')
export const CLIENT_MAIN = path.join(SRC, 'index')
export const CLIENT_BUILD = path.join(BUILD, 'static')
export const SERVER_MAIN = path.join(SRC, 'app')
export const SERVER_BUILD = path.join(BUILD, 'ssr')
export const MODULES = path.join(__dirname, '../node_modules')
