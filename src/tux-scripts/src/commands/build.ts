import ora from 'ora'
import merge from 'deepmerge'
import chalk from 'chalk'
import { Stats, Compiler } from 'webpack'
import printBuildError from 'react-dev-utils/printBuildError'
import { run } from '../compiler'
import { Args } from '../options'

export default async (args: Args) => {
  args = merge<Args>(
    {
      options: {
        env: {
          NODE_ENV: process.env.NODE_ENV || 'production',
        },
      },
      middleware: [],
    },
    args
  )

  const spinner = ora('Building project').start()
  let result
  try {
    result = await run('build', args)
  } catch (err) {
    spinner.fail('Failed to compile.')
    printBuildError(err)
    process.exit(1)
  }

  const { warnings } = result
  if (warnings.length) {
    spinner.warn('Compiled with warnings.')
    // tslint:disable-next-line:no-console
    console.log(warnings.join('\n\n'))
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
  } else {
    spinner.succeed('Compiled successfully.')
  }
}
