import Server from '../server'
import { Args } from '../options'

export default async (options: Args, buildPath: string) => {
  new Server({
    buildPath,
  })
}
