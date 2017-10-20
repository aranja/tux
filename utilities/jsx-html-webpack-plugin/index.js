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
  }

  apply(compiler) {
    this.options.template = this.getFullTemplatePath(
      this.options.document,
      compiler.context
    )
    this.options.inject = false

    this.htmlPlugin = new HtmlWebpackPlugin(
      omit(this.options, ['document', 'manifestFileName', 'props'])
    )
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

  getFullTemplatePath(template, context) {
    return `${require.resolve('./src/loader')}!${require.resolve(
      './src/renderer'
    )}?${path.resolve(context, template)}`
  }
}

module.exports = JsxHtmlWebpackPlugin
