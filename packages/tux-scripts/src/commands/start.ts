import ora from 'ora'
import { Compiler } from 'webpack'
import { run } from '../compiler'
import { CliOptions } from '../options'

export default async (options: CliOptions, buildPath: string) => {
  const {
    ssr = false,
    port,
    host,
  } = options
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'

  const spinner = ora('Building project').start()
  let compilers
  try {
    compilers = await run('start', { ssr, port, host }) as Compiler[]
  } catch (err) {
    spinner.fail('Building project failed')
    throw err
  }

  const [ browserCompiler, serverCompiler ] = compilers
  if (!browserCompiler.options.devServer) {
    return spinner.succeed('Build completed')
  }

  const { devServer } = browserCompiler.options
  const protocol = devServer.https ? 'https' : 'http'
  let compileCount = compilers.length

  spinner.succeed(
    `Development server running on: ${protocol}://${devServer.host}:${devServer.port}`
  )

  const building = ora('Waiting for initial build to finish').start()
  compilers.forEach(compiler => {
    compiler.plugin('done', () => {
      compileCount--
      if (compileCount === 0) {
        building.succeed('Build completed')
      }
    })
    compiler.plugin('compile', () => {
      compileCount++
      building.text = 'Source changed, re-compiling'
      building.start()
    })
  })
}
