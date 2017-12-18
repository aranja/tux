import merge from 'deepmerge'
import { run } from '../compiler'

export default async (args: Args, ...rest) => {
  args = merge<Args>(
    {
      options: {
        env: {
          NODE_ENV: process.env.NODE_ENV || 'test',
        },
      },
      middleware: [],
    },
    args
  )

  await run('test', args)
}
