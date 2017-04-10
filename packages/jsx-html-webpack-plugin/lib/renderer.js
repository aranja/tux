/* globals Document */
'use strict'

const React = require('react')
const ReactDOMServer = require('react-dom/server')

module.exports = (params) => {
  const assets = params.htmlWebpackPlugin.files
  const options = params.htmlWebpackPlugin.options
  const props = Object.assign({ title: options.title }, assets, options.props)

  const element = React.createElement(Document, props)
  return ReactDOMServer.renderToStaticMarkup(element)
}
