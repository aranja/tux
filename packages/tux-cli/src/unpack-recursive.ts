import tmp from 'tmp'
import tar from 'tar'
import fs from 'fs-extra'

function temporaryDir<T>(fn: (path: string) => Promise<T>) {
  return new Promise((resolve, reject) => {
    tmp.dir((error, path, cleanup) => {
      if (error) {
        return reject(error)
      }
      fn(path).then(
        result => { cleanup(); resolve(result) },
        error => { cleanup(); reject(error) }
      )
    })
  })
}

function extractPackageJson(pkgFile: string) {
  return temporaryDir(async path =>
    await tar.extract({ file: pkgFile, cwd: path }, ['package.json'])
  })
}

export function getLocalDependencies(pkgFile: string) {
  return temporaryDir(async path => {
    tar.extract({ file: pkgFile, cwd: path }, ['package.json'], )
  })
}
