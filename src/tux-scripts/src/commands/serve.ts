import Server from '../server'
import { Args } from '../options'

export default async (args: Args, buildPath: string) => {
  const { host, port } = args.options
  return new Server({
    buildPath,
    port,
    host,
  })
}
