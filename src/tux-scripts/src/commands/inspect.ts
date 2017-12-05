import ora from 'ora'
import merge from 'deepmerge'
import { Compiler } from 'webpack'
import { run } from '../compiler'
import { Args } from '../options'

export default async (args: Args) => {
  args = merge<Args>(
    {
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

  const compiler = await run('inspect', args)
  // tslint:disable-next-line:no-console
  console.log(compiler)
}
