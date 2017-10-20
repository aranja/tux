import ora from 'ora'
import merge from 'deepmerge'
import { Compiler } from 'webpack'
import { run } from '../compiler'
import { Args } from '../options'

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

  try {
    const results = await run('inspect', args)
    ora('Browser config').info()
    // tslint:disable-next-line:no-console
    console.log(results[0])
    if (results[1]) {
      ora('Server config').info()
      // tslint:disable-next-line:no-console
      console.log(results[1])
    }
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err)
  }
}
