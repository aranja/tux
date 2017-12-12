/**
 * Copyright (c) 2015-2017, Facebook, Inc.
 * Copyright (c) 2017, Aranja ehf.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// tux-cli is installed globally on people's computers. This means
// that it is extremely difficult to have them upgrade the version and
// because there's only one global version installed, it is very prone to
// breaking changes.
//
// The only job of tux-cli is to init a project repository and then
// forward all the commands to the local version of tux-scripts.
//
// If you need to add a new command, please add it to the tux-scripts/ package.
//
// The only reason to modify this file is to add more warnings and
// troubleshooting information for the `tux` command.
//
// Do not make breaking changes! We absolutely don't want to have to
// tell people to update their global version of tux-cli.
//
// Also be careful with new language features.
// This file must work on Node 4+.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// tslint:disable:no-console
import yargs, { Argv } from 'yargs'
import validateProjectName from 'validate-npm-package-name'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import spawn from 'cross-spawn'
import semver from 'semver'
import dns from 'dns'

const argv = (yargs as Argv)
  .option('verbose', { describe: 'Print additional logs' })
  .option('version', {
    describe: 'Use a non-standard version of tux',
  })
  .command('new', 'Create a new tux project')
  .demandCommand(1, 'Please specify a command.\nUSAGE:  $0 <command>')
  .help('help').argv

const projectDir = argv._[1]
const root = path.resolve(projectDir)
const appName = path.basename(root)
createApp(argv.verbose, argv.version).catch(onError)

async function createApp(verbose: boolean, version: string) {
  checkAppName(appName)
  await fs.ensureDir(root)
  const isSafe = await isSafeToCreateProjectIn(root)
  if (!isSafe) {
    console.log(
      `The directory ${chalk.green(
        appName
      )} contains files that could conflict.`
    )
    console.log('Try using a new directory name.')
    process.exit(1)
  }

  console.log(`Creating a new React app in ${chalk.green(root)}.`)
  console.log()

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  }
  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )
  process.chdir(root)

  await run(appName, version, verbose)
}

async function onError(reason: Error | { command: string }) {
  console.log()
  console.log('Aborting installation.')
  if (reason instanceof Error) {
    console.log(chalk.red('Unexpected error. Please report it as a bug:'))
    console.log(reason)
  } else {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`)
  }
  console.log()

  // On 'exit' we will delete these files from target directory.
  const knownGeneratedFiles = [
    'package.json',
    'npm-debug.log',
    'yarn-error.log',
    'yarn-debug.log',
    'node_modules',
  ]
  const currentFiles = await fs.readdir(path.join(root))
  for (const file of currentFiles) {
    for (const fileToMatch of knownGeneratedFiles) {
      // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
      // and the rest of knownGeneratedFiles.
      if (
        (fileToMatch.match(/.log/g) && file.indexOf(fileToMatch) === 0) ||
        file === fileToMatch
      ) {
        console.log(`Deleting generated file... ${chalk.cyan(file)}`)
        await fs.remove(path.join(root, file))
      }
    }
  }
  const remainingFiles = await fs.readdir(path.join(root))
  if (!remainingFiles.length) {
    // Delete target folder if empty
    console.log(
      `Deleting ${chalk.cyan(`${appName} /`)} from ${chalk.cyan(
        path.resolve(root, '..')
      )}`
    )
    process.chdir(path.resolve(root, '..'))
    await fs.remove(path.join(root))
  }
  console.log('Done.')
  process.exit(1)
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function install(
  useYarn: boolean,
  dependencies: string[],
  verbose: boolean,
  isOnline: boolean
) {
  return new Promise((resolve, reject) => {
    let command: string
    let args: string[]
    if (useYarn) {
      command = 'yarnpkg'
      args = ['add', '--exact']
      if (!isOnline) {
        args.push('--offline')
      }
      ;[].push.apply(args, dependencies)

      if (!isOnline) {
        console.log(chalk.yellow('You appear to be offline.'))
        console.log(chalk.yellow('Falling back to the local Yarn cache.'))
        console.log()
      }
    } else {
      checkNpmVersion()
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

async function run(app: string, version: string, verbose: boolean) {
  const allDependencies = [appendVersion('tux-scripts', version)]

  console.log('Installing packages. This might take a couple minutes.')

  const useYarn = shouldUseYarn()

  const isOnline = await checkIfOnline(useYarn)

  console.log(`Installing ${chalk.cyan('tux-scripts')}...`)
  console.log()

  await install(useYarn, allDependencies, verbose, isOnline)

  checkNodeVersion()

  // Since react-scripts has been installed with --save
  // we need to move it into devDependencies and rewrite package.json
  // also ensure react dependencies have caret version range
  await fixDependencies()

  const scriptsPath = path.resolve(
    process.cwd(),
    'node_modules',
    'tux-scripts',
    'new'
  )
  const init = require(scriptsPath)
  await init(root, app, verbose)
}

function appendVersion(packageToInstall: string, version: string) {
  const validSemver = semver.valid(version)
  if (validSemver) {
    packageToInstall += `@${validSemver}`
  }
  return packageToInstall
}

function checkNpmVersion() {
  let isNpm2 = false
  try {
    const npmVersion = execSync('npm --version').toString()
    isNpm2 = semver.lt(npmVersion, '3.0.0')
  } catch (err) {
    return
  }
  if (!isNpm2) {
    return
  }
  console.log(chalk.yellow('It looks like you are using npm 2.'))
  console.log(
    chalk.yellow(
      'We suggest using npm 3 or Yarn for faster install times ' +
        'and less disk space usage.'
    )
  )
  console.log()
}

function checkNodeVersion() {
  const packageJsonPath = path.resolve(
    process.cwd(),
    'node_modules',
    'tux-scripts',
    'package.json'
  )
  const packageJson = require(packageJsonPath)
  if (!packageJson.engines || !packageJson.engines.node) {
    return
  }

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(
      chalk.red(
        'You are running Node %s.\n' +
          'Tux requires Node %s or higher. \n' +
          'Please update your version of Node.'
      ),
      process.version,
      packageJson.engines.node
    )
    process.exit(1)
  }
}

function checkAppName(app: string) {
  const validationResult = validateProjectName(app)
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(`"${app}"`)}` +
        `because of npm naming restrictions:`
    )
    printValidationResults(validationResult.errors)
    printValidationResults(validationResult.warnings)
    process.exit(1)
  }

  const dependencies = ['react', 'react-dom', 'tux']
  const devDependencies = ['tux-scripts']
  const allDependencies = dependencies.concat(devDependencies).sort()
  if (allDependencies.indexOf(app) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          app
        )} because a dependency ` +
          `with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
        chalk.cyan(allDependencies.map(depName => `  ${depName}`).join('\n')) +
        chalk.red('\n\nPlease choose a different project name.')
    )
    process.exit(1)
  }
}

function makeCaretRange(dependencies: { [key: string]: string }, name: string) {
  const version = dependencies[name]

  if (typeof version === 'undefined') {
    console.error(chalk.red(`Missing ${name} dependency in package.json`))
    process.exit(1)
  }

  let patchedVersion = `^${version}`

  if (!semver.validRange(patchedVersion)) {
    console.error(
      `Unable to patch ${name} dependency version because version ${chalk.red(
        version
      )} will ` + `become invalid ${chalk.red(patchedVersion)}`
    )
    patchedVersion = version
  }

  dependencies[name] = patchedVersion
}

async function fixDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = require(packagePath)

  if (typeof packageJson.dependencies === 'undefined') {
    console.error(chalk.red('Missing dependencies in package.json'))
    process.exit(1)
  }

  const packageVersion = packageJson.dependencies['tux-scripts']

  if (typeof packageVersion === 'undefined') {
    console.error(chalk.red(`Unable to find tux-scripts in package.json`))
    process.exit(1)
  }

  packageJson.devDependencies = packageJson.devDependencies || {}
  packageJson.devDependencies['tux-scripts'] = packageVersion
  delete packageJson.dependencies['tux-scripts']

  await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2))
}

// If project only contains files generated by GH, it’s safe.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebookincubator/create-react-app/pull/368#issuecomment-243446094
async function isSafeToCreateProjectIn(rootDir: string) {
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    'web.iml',
    '.hg',
    '.hgignore',
    '.hgcheck',
  ]
  const files = await fs.readdir(rootDir)
  return files.every(file => validFiles.indexOf(file) >= 0)
}

function checkIfOnline(useYarn: boolean): Promise<boolean> {
  if (!useYarn) {
    // Don't ping the Yarn registry.
    // We'll just assume the best case.
    return Promise.resolve(true)
  }

  return new Promise(resolve => {
    dns.lookup('registry.yarnpkg.com', err => {
      resolve(err === null)
    })
  })
}

function printValidationResults(results?: string[]) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`))
    })
  }
}
