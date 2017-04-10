import { Neutrino } from 'neutrino'
import JsxHtmlPlugin from 'jsx-html-webpack-plugin'
import merge from 'lodash/merge'

/**
 * Create a html template using a react component.
 */
export default ({ config }: Neutrino, options: any) => {
  config
    .plugin('html')
    .use(JsxHtmlPlugin, [
      options,
    ])
}
