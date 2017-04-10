import fs from 'fs-p'
import pkgDir from 'pkg-dir'
import chalk from 'chalk'
import { join } from 'path'

async function run() {
  const rootPath = await pkgDir()
  const scriptsPath = join(rootPath, 'node_modules', '.bin', 'tux-scripts')
  const insideTuxProject = await fs.exists(scriptsPath)

  if (insideTuxProject) {
    console.log(`Inside ${chalk.cyan('tux')} project.`)
    require(scriptsPath)
  } else {
    console.log(`Not inside ${chalk.cyan('tux')} project.`)
    require('./new')
  }
}
