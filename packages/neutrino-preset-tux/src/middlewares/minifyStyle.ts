import { Neutrino } from 'neutrino'

export default ({ config }: Neutrino) => {
  // Minimize css with source maps.
  const styleRule = config.module
    .rule('style')
    .use('css')
    .tap((options: any) => ({
      ...options,
      sourceMap: true,
      minimize: true,
    }))
}
