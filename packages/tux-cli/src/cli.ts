import fs from 'fs-extra'
import pkgDir from 'pkg-dir'
import chalk from 'chalk'
import { join } from 'path'

async function run() {
  const rootPath = await pkgDir()
  const isInPackage = rootPath !== null

  if (isInPackage) {
    const scriptsPath = join(rootPath, 'node_modules', '.bin', 'tux-scripts')
    const insideTuxProject = await fs.pathExists(scriptsPath)

    if (insideTuxProject) {
      // tslint:disable-next-line:no-console
      console.log(`Inside ${chalk.cyan('tux')} project.`)
      require(scriptsPath)
      return
    }
  }

  // tslint:disable-next-line:no-console
  console.log(`Not inside ${chalk.cyan('tux')} project.`)
  require('./new')
}

run()
