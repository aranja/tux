import webpack, { Configuration } from 'webpack'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'

export function start(config: Configuration | Configuration[]) {
  if (!Array.isArray(config)) {
    throw new Error(
      'Start command expects a webpack MultiConfiguration. Did you override the target option?'
    )
  }

  return webpack(config)
}

export function build<T>(config: T) {
  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const messages = formatWebpackMessages(stats.toJson())
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }

      return resolve({
        stats,
        warnings: messages.warnings,
      })
    })
  })
}
