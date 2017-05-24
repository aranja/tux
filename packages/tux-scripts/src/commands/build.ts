import ora from 'ora'
import { Stats } from 'webpack'
import { run } from '../compiler'
import { CliOptions } from '../options'

export default async (options: CliOptions) => {
  const {
    ssr = true,
    admin = !!process.env.ADMIN,
  } = options
  process.env.NODE_ENV = options.env || process.env.NODE_ENV || 'production'

  const spinner = ora('Building project').start()
  let result
  try {
    result = await run('build', { ssr, admin }) as Stats[]
  } catch (err) {
    spinner.fail('Building project failed')
    throw err
  }

  const [ browserStats, serverStats ] = result

  spinner.succeed('Building project completed')
  // tslint:disable-next-line:no-console
  console.log(browserStats.toString({
    colors: true,
    chunks: false,
    children: false,
  }))
}
