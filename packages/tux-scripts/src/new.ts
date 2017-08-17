/**
 * Copyright (c) 2015-2017, Facebook, Inc.
 * Copyright (c) 2017, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// tslint:disable:no-console
import fs from 'fs-extra'
import path from 'path'
import spawn from 'cross-spawn'
import chalk from 'chalk'

function install(useYarn: boolean, dependencies: string[], verbose: boolean) {
  return new Promise((resolve, reject) => {
    let command: string
    let args: string[]
    if (useYarn) {
      command = 'yarnpkg'
      args = ['add', '--exact']
      Array.prototype.push.apply(args, dependencies)
    } else {
      command = 'npm'
      args = ['install', '--save', '--save-exact'].concat(dependencies)
    }

    if (verbose) {
      args.push('--verbose')
    }

    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', (code: number) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        })
        return
      }
      resolve()
    })
  })
}

const init = async (
  appPath: string,
  appName: string,
  verbose: boolean,
  originalDirectory: string
) => {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name
  const ownPath = path.join(appPath, 'node_modules', ownPackageName)
  const appPackage = require(path.join(appPath, 'package.json'))
  const useYarn = await fs.pathExists(path.join(appPath, 'yarn.lock'))

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {}
  appPackage.devDependencies = appPackage.devDependencies || {}

  // Setup the script rules
  appPackage.scripts = {
    start: 'tux-scripts start',
    build: 'tux-scripts build',
    serve: 'tux-scripts serve',
  }

  await fs.writeFile(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  )

  const readmeExists = await fs.exists(path.join(appPath, 'README.md'))
  if (readmeExists) {
    await fs.rename(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    )
  }

  // Copy the files for the user
  const templatePath = path.join(ownPath, 'template', 'new')
  if (await fs.exists(templatePath)) {
    await fs.copy(templatePath, appPath)
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    )
    return
  }

  let dependencies = ['tux', 'tux-adapter-contentful']

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  )
  if (await fs.exists(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies
    dependencies = dependencies.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`
      })
    )
    await fs.unlink(templateDependenciesPath)
  }
  console.log(`Installing dependencies...`)
  console.log(dependencies.join(', '))
  await install(useYarn, dependencies, verbose)

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm'

  console.log()
  console.log(`Success! Created ${appName} at ${appPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} start`))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`))
  console.log('    Bundles the app into static files for production.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}serve`))
  console.log('    Starts a server for the built output.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`)
  if (readmeExists) {
    console.log()
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    )
  }
  console.log()
  console.log('Happy hacking!')
}

export default init
