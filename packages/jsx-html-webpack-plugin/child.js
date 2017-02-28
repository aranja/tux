'use strict';

process.on('message', options => {
  require('babel-register')(options.babel);
  const React = require('react');
  const ReactDOM = require('react-dom/server');
  let Html = require(options.template);
  if (typeof Html === 'object' && Html.__esModule && Html.default) {
    Html = Html.default;
  }

  const element = React.createElement(Html, options.props);
  const html = ReactDOM.renderToStaticMarkup(element);
  process.send({ html: `<!doctype html>${html}` });
});
