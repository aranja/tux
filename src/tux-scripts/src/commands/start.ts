import ora from 'ora'
import merge from 'deepmerge'
import { Compiler } from 'webpack'
import chalk from 'chalk'
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils'
import clearConsole from 'react-dev-utils/clearConsole'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import { run } from '../compiler'
import { Args } from '../options'

const isInteractive = process.stdout.isTTY

export default async (args: Args) => {
  args = merge<Args>(
    {
      ssr: args.ssr != null ? args.ssr : false,
      options: {
        port: parseInt(process.env.PORT, 10) || 5000,
        host: process.env.HOST || '0.0.0.0',
        https: process.env.HTTPS === 'true',
        tux: {
          admin: true,
        },
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development',
        },
      },
      middleware: [],
    },
    args
  )

  await fixPort(args)
  if (args.options.port == null) {
    return
  }

  if (isInteractive) {
    clearConsole()
  }
  const spinner = ora('Building project').start()
  let compilers
  try {
    compilers = (await run('start', args)) as Compiler[]
  } catch (err) {
    spinner.fail('Building project failed')
    throw err
  }

  const [browserCompiler, serverCompiler] = compilers
  if (!browserCompiler.options.devServer) {
    return spinner.succeed('Build completed')
  }

  const { devServer } = browserCompiler.options
  const protocol = devServer.https ? 'https' : 'http'
  let compileCount = compilers.length

  spinner.succeed(
    `Development server running on: ${protocol}://${devServer.host}:${devServer.port}`
  )

  const building = ora('Waiting for initial build to finish').start()
  compilers.forEach(compiler => {
    compiler.plugin('done', stats => {
      compileCount--
      if (compileCount > 0) {
        // What if builds have different results.
        return
      }

      // We have switched off the default Webpack output in WebpackDevServer
      // options so we are going to "massage" the warnings and errors and present
      // them in a readable focused way.
      const messages = formatWebpackMessages(stats.toJson({}, true))
      const isSuccessful = !messages.errors.length && !messages.warnings.length
      if (isSuccessful) {
        building.succeed('Build completed')
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        building.fail('Failed to compile')
        // tslint:disable-next-line:no-console
        console.log(messages.errors.join('\n\n'))
        return
      }

      // Show warnings if no errors were found.
      if (messages.warnings.length) {
        building.warn('Compiled with warnings')
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
    compiler.plugin('invalid', () => {
      if (isInteractive) {
        clearConsole()
      }
      compileCount++
      building.text = 'Source changed, re-compiling'
      building.start()
    })
  })
}

async function fixPort({ options }: Args) {
  options.port = await choosePort(options.host, options.port)
}
