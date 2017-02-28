'use strict'
const child_process = require('child_process');
const path = require('path');

class JsxHtmlWebpackPlugin {
  constructor(options) {
    // Default options
    this.options = Object.assign({
      template: null,
      filename: 'index.html',
      manifestFileName: null,
      babel: null,
      env: {},
    }, options);

    // Guards.
    if (!this.options.template) {
      throw new Error('JsxHtmlWebpackPlugin requires a jsx template.');
    }
  }

  apply (compiler) {
    compiler.plugin('emit', this.buildHtml.bind(this));
  }

  buildHtml(compilation, callback) {
    const filename = this.options.filename;
    const template = this.options.template;
    const babel = this.options.babel;
    const env = Object.assign({}, process.env, this.options.env);

    // Add dependency to template file so changes to it recompile with --watch.
    compilation.fileDependencies.unshift(template);

    // Collect assets from the build for injecting into the template.
    const assets = this.htmlWebpackPluginAssets(compilation);
    const props = Object.assign({}, this.options.props, { assets });

    // Fork a process to run the react template.
    const child = child_process.fork(path.join(__dirname, 'child.js'), { env });
    child.send({ babel, template, props });

    child.on('message', (result) => {
      let html = result.html;
      if (this.options.minify) {
        const minify = require('html-minifier').minify;
        html = minify(html, this.options.minify);
      }

      // Replace the compilation result with the evaluated html code
      compilation.assets[filename] = {
        source: function () {
          return html;
        },
        size: function () {
          return html.length;
        }
      };

      child.kill();
      callback();
    });
  }

  // For now, get asset logic from ManifestPlugin.
  htmlWebpackPluginAssets(compilation) {
    const manifestFileName = this.options.manifestFileName;
    if (!manifestFileName) {
      return [];
    }
    const manifest = compilation.assets[manifestFileName];
    if (!manifest) {
      throw new Error('Could not find manifest in compilation. Is JsxHtmlWebpackPlugin configured after ManifestPlugin?');
    }
    return JSON.parse(manifest.source());
  }
}

module.exports = JsxHtmlWebpackPlugin;
