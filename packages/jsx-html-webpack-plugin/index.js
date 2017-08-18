'use strict'
const vm = require('vm')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const omit = require('lodash/omit')
const ReactDocument = require('react-document')
const path = require('path')

class JsxHtmlWebpackPlugin {
  constructor(options) {
    // Default options
    this.options = Object.assign(
      {
        document: ReactDocument.file,
        assetsFileName: 'assets.json',
        props: {},
      },
      options
    )

    this.options.document = this.options.document || ReactDocument.file

    // Guards.
    if (typeof this.options.document !== 'string') {
      throw new Error(
        'JsxHtmlWebpackPlugin requires a file with a jsx Document.'
      )
    }

    const htmlPluginOptions = Object.assign(
      {
        template: `${require.resolve('./src/loader')}!${require.resolve(
          './src/renderer'
        )}?${this.options.document}`,
        inject: false,
      },
      omit(options, ['document', 'manifestFileName', 'props'])
    )
    this.htmlPlugin = new HtmlWebpackPlugin(htmlPluginOptions)
  }

  apply(compiler) {
    this.htmlPlugin.apply(compiler)

    compiler.plugin('compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-after-html-processing',
        (htmlPluginData, callback) => {
          if (this.options.assetsFileName) {
            const assets = JSON.stringify(htmlPluginData.assets, null, 2)
            compilation.assets[this.options.assetsFileName] = {
              source: () => assets,
              size: () => assets.length,
            }
          }

          callback(null, htmlPluginData)
        }
      )
    })
  }
}

module.exports = JsxHtmlWebpackPlugin
