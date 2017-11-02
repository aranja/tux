import ora from 'ora'
import merge from 'deepmerge'
import { Stats, Compiler } from 'webpack'
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
  let compiler
  try {
    compiler = await run('build', args)
  } catch (err) {
    spinner.fail('Building project failed')
    throw err
  }
}
