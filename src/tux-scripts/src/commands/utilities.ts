import { choosePort } from 'react-dev-utils/WebpackDevServerUtils'
import { Args } from '../options'

interface ExitError extends Error {
  code: string
  exitCode: number
}

export const getServerOptions = async (args: Args) => {
  const host = args.host || process.env.HOST || '0.0.0.0'
  const https = args.https || process.env.HTTPS === 'true'
  let port = args.port || parseInt(process.env.PORT || '0', 10) || 5000
  port = await choosePort(host, port)

  // Could not reserve port and user cancelled.
  if (port == null) {
    throw exitProcess()
  }

  return {
    host,
    port,
    https,
  }
}

export const exitProcess = (exitCode = 0) => {
  const error = new Error() as ExitError
  error.code = 'TUX_SOFT_EXIT'
  error.exitCode = exitCode
  return error
}
