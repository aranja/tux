/*
 * This file uses webpack to compile a template with a child compiler.
 *
 * [TEMPLATE] -> [JAVASCRIPT]
 *
 */
'use strict';
const path = require('path');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

/**
 * Compiles the template into a nodejs factory, adds its to the compilation.assets
 * and returns a promise of the result asset object.
 *
 * @param template relative path to the template file
 * @param context path context
 * @param outputFilename the file name
 * @param compilation The webpack compilation object
 *
 * Returns an object:
 * {
 *  hash: {String} - Base64 hash of the file
 *  content: {String} - Javascript executable code of the template
 * }
 *
 */
module.exports.compileTemplate = function compileTemplate (template, context, outputFilename, compilation) {
  // The entry file is just an empty helper as the dynamic template
  // require is added in "loader.js"
  const outputOptions = {
    filename: outputFilename,
    publicPath: compilation.outputOptions.publicPath
  };
  // Store the result of the parent compilation before we start the child compilation
  const assetsBeforeCompilation = Object.assign({}, compilation.assets[outputOptions.filename]);
  // Create an additional child compiler which takes the template
  // and turns it into an Node.JS html factory.
  // This allows us to use loaders during the compilation
  const compilerName = getCompilerName(context, outputFilename);
  const childCompiler = compilation.createChildCompiler(compilerName, outputOptions);
  childCompiler.context = context;
  childCompiler.apply(
    new NodeTemplatePlugin(outputOptions),
    new NodeTargetPlugin(),
    new LibraryTemplatePlugin('JSX_HTML_WEBPACK_PLUGIN_RESULT', 'var'),
    new SingleEntryPlugin(this.context, template),
    new LoaderTargetPlugin('node')
  );

  // Fix for "Uncaught TypeError: __webpack_require__(...) is not a function"
  // Hot module replacement requires that every child compiler has its own
  // cache. @see https://github.com/ampedandwired/html-webpack-plugin/pull/179
  childCompiler.plugin('compilation', function (compilation) {
    if (compilation.cache) {
      if (!compilation.cache[compilerName]) {
        compilation.cache[compilerName] = {};
      }
      compilation.cache = compilation.cache[compilerName];
    }
  });

  // Compile and return a promise
  return new Promise(function (resolve, reject) {
    childCompiler.runAsChild(function (err, entries, childCompilation) {
      // Resolve / reject the promise
      if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
        const errorDetails = childCompilation.errors.map(function (error) {
          return error.message + (error.error ? ':\n' + error.error : '');
        }).join('\n');
        reject(new Error('Child compilation failed:\n' + errorDetails));
      } else if (err) {
        reject(err);
      } else {
        // Replace [hash] placeholders in filename
        const outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
          hash: childCompilation.hash,
          chunk: entries[0]
        });
        // Restore the parent compilation to the state like it
        // was before the child compilation
        compilation.assets[outputName] = assetsBeforeCompilation[outputName];
        if (assetsBeforeCompilation[outputName] === undefined) {
          // If it wasn't there - delete it
          delete compilation.assets[outputName];
        }
        resolve({
          // Hash of the template entry point
          hash: entries[0].hash,
          // Output name
          outputName: outputName,
          // Compiled code
          content: childCompilation.assets[outputName].source()
        });
      }
    });
  });
};

/**
 * Returns the child compiler name e.g. 'jsx-html-webpack-plugin for "index.html"'
 */
function getCompilerName (context, filename) {
  const absolutePath = path.resolve(context, filename);
  const relativePath = path.relative(context, absolutePath);
  return 'jsx-html-webpack-plugin for "' + (absolutePath.length < relativePath.length ? absolutePath : relativePath) + '"';
}