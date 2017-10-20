import ora from 'ora'
import merge from 'deepmerge'
import { Stats } from 'webpack'
import { run } from '../compiler'
import { Args } from '../options'

export default async (args: Args) => {
  args = merge<Args>(
    {
      ssr: args.ssr != null ? args.ssr : true,
      options: {
        tux: {
          admin: false,
        },
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
    result = (await run('build', args)) as Stats[]
  } catch (err) {
    spinner.fail('Building project failed')
    throw err
  }

  const [browserStats, serverStats] = result

  spinner.succeed('Building project completed')
  // tslint:disable-next-line:no-console
  console.log(
    browserStats.toString({
      colors: true,
      chunks: false,
      children: false,
    })
  )
}
