'use strict';

const ts = require('typescript');
const babelJest = require('babel-jest');
const path = require('path');

// Look up and parse ts config.
const configPath = path.resolve('tsconfig.json');
const configJson = require(configPath);
const tsConfig = ts.parseJsonConfigFileContent(configJson, ts.sys, process.cwd());

module.exports = {
  process: function (src, path) {
    const isTypeScript = path.endsWith('.ts') || path.endsWith('.tsx');
    const isJavaScript = path.endsWith('.js') || path.endsWith('.jsx');

    if (isTypeScript) {
      src = ts.transpile(
        src,
        tsConfig.options,
        path,
        []
      );
    }

    if (isJavaScript || isTypeScript) {
      // babel jest hack for transpile string src
      const fileName = isJavaScript
        ? path
        : 'file.js';

      src = babelJest.process(
        src,
        fileName
      );
    }

    return src;
  }
};
