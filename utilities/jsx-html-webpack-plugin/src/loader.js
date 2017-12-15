'use strict'
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  const documentFile = this.resourceQuery.slice(1)

  return `
    ${source}
    
    var Document = require(${loaderUtils.stringifyRequest(this, documentFile)})
    if (typeof Document === 'object' && Document.__esModule && Document.default) {
      Document = Document.default
    }
  `
}
