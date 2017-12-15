import ora from 'ora'
import Server from '../server'
import { Args } from '../options'
import { getServerOptions } from './utilities'

export default async (args: Args, buildPath: string) => {
  const serverOptions = await getServerOptions(args)
  const protocol = serverOptions.https ? 'https' : 'http'
  const url = `${protocol}://${serverOptions.host}:${serverOptions.port}`

  const server = new Server({
    buildPath,
    ...serverOptions,
  })
  await server.listen()

  const spinner = ora()
  spinner.succeed(`Server running on: ${url}`)
}
