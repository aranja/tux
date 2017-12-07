import ora from 'ora'
import merge from 'deepmerge'
import { Compiler, Stats, MultiCompiler } from 'webpack'
import chalk from 'chalk'
import clearConsole from 'react-dev-utils/clearConsole'
import openBrowser from 'react-dev-utils/openBrowser'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import { run } from '../compiler'
import { Args } from '../options'
import Server from '../server'
import { exitProcess, getServerOptions } from './utilities'

const isInteractive = process.stdout.isTTY

export default async (args: Args) => {
  const serverOptions = await getServerOptions(args)
  const protocol = serverOptions.https ? 'https' : 'http'
  const url = `${protocol}://${serverOptions.host}:${serverOptions.port}`

  args = merge<Args>(
    {
      options: {
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development',
        },
      },
      middleware: [],
    },
    args
  )

  if (isInteractive) {
    clearConsole()
  }
  const spinner = ora('Compiling project').start()
  let multiCompiler: MultiCompiler
  try {
    multiCompiler = await run('start', args)
  } catch (err) {
    spinner.fail('Failed to compile')
    console.log()
    console.log(err.message || err)
    console.log()
    throw exitProcess(1)
  }

  const server = new Server({
    multiCompiler,
    ...serverOptions,
  })
  await server.listen()

  spinner.succeed(`Development server running on: ${url}`)
  openBrowser(url)

  const building = ora('Waiting for initial compilation to finish').start()
  multiCompiler.plugin('done', (stats: Stats) => {
    if (isInteractive) {
      clearConsole()
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      building.succeed(`Compiled successfully!`)
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      building.fail(`Failed to compile`)
      // tslint:disable-next-line:no-console
      console.log(messages.errors.join('\n\n'))
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      building.warn(`${name}: Compiled with warnings`)
      // tslint:disable-next-line:no-console
      console.log(messages.warnings.join('\n\n'))

      // Teach some ESLint tricks.
      // tslint:disable-next-line:no-console
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      )
      // tslint:disable-next-line:no-console
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      )
    }
  })

  multiCompiler.plugin('invalid', () => {
    if (isInteractive) {
      clearConsole()
    }
    building.text = 'Compiling...'
    building.start()
  })
}
