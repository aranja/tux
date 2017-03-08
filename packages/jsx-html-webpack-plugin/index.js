'use strict'
const vm = require('vm');
const childCompiler = require('./lib/compiler');
const prettyError = require('./lib/errors');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const path = require('path');

class JsxHtmlWebpackPlugin {
  constructor(options) {
    // Default options
    this.options = Object.assign({
      template: null,
      cache: true,
      filename: 'index.html',
      manifestFileName: null,
      showErrors: true,
    }, options);

    // Guards.
    if (!this.options.template) {
      throw new Error('JsxHtmlWebpackPlugin requires a jsx template.');
    }
  }

  apply (compiler) {
    let compilationResult = null;
    let isCompilationCached = false;
    let previousAssetJson = null;

    compiler.plugin('make', (compilation, callback) => {
      childCompiler.compileTemplate(this.options.template, compiler.context, this.options.filename, compilation)
        .then(newResult => {
          isCompilationCached = compilationResult && newResult.hash === compilationResult.hash;
          compilationResult = newResult;
          callback();
        });
    });

    compiler.plugin('emit', (compilation, callback) => {
      // Get assets
      const assets = this.htmlWebpackPluginAssets(compilation);

      // If the template and the assets did not change we don't have to emit the html
      const assetJson = JSON.stringify(assets);
      if (isCompilationCached && this.options.cache && assetJson === previousAssetJson) {
        return callback();
      } else {
        previousAssetJson = assetJson;
      }

      Promise.resolve()
        // Get the actual JSX component.
        .then(() => {
          // Allow to use a custom function instead
          if (this.options.component) {
            return this.options.component;
          }
          // Once everything is compiled, evaluate the jsx component.
          return this.evaluateCompilationResult(compilationResult.content);
        })
        // Render the component.
        .then(DocumentComponent => {
          return this.renderComponent(DocumentComponent, assets);
        })
        // In case anything went wrong the promise is resolved
        // with the error message and an error is logged
        .catch(err => {
          compilation.errors.push(prettyError(err, compiler.context).toString());
          // Prevent caching
          compilationResult.hash = null;
          return this.options.showErrors ? prettyError(err, compiler.context).toHtml() : 'ERROR';
        })
        // Replace the compilation result with the evaluated html code
        .then(function (html) {
          compilation.assets[compilationResult.outputName] = {
            source: function () {
              return html;
            },
            size: function () {
              return html.length;
            },
          };
        })
        .then(callback, callback)
    });
  }

  evaluateCompilationResult(source) {
    if (!source) {
      return Promise.reject('The child compilation didn\'t provide a result');
    }

    // The LibraryTemplatePlugin stores the template result in a local variable.
    // To extract the result during the evaluation this part has to be removed.
    source = source.replace('var JSX_HTML_WEBPACK_PLUGIN_RESULT =', '');
    const vmContext = vm.createContext(Object.assign({JSX_HTML_WEBPACK_PLUGIN: true, require: require}, global));
    const vmScript = new vm.Script(source, {filename: this.options.template});
    // Evaluate code and cast to string
    let newSource;
    try {
      newSource = vmScript.runInContext(vmContext);
    } catch (e) {
      return Promise.reject(e);
    }
    if (typeof newSource === 'object' && newSource.__esModule && newSource.default) {
      newSource = newSource.default;
    }
    return typeof newSource === 'function'
      ? Promise.resolve(newSource)
      : Promise.reject('The loader "' + this.options.template + '" didn\'t return a JSX component.');
  }

  renderComponent(Component, assets) {
    const props = Object.assign({ assets: assets }, this.options.props);
    const element = React.createElement(Component, props);
    return ReactDOMServer.renderToStaticMarkup(element);
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
