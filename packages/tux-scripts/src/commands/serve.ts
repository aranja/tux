import Server from '../server'
import { CliOptions } from '../options'

export default async (options: CliOptions, buildPath: string) => {
  const {
    port,
    host,
  } = options

  new Server({
    buildPath,
    port,
    host,
  })
}
