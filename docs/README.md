# TUX

Create content-driven websites with React.

Tux takes care of Webpack and SSR, allowing you to focus on building the website of your dreams. Take advantage of the full React ecosystem and all of the recent innovations without "ejecting".

Tux uses [add-ons](/add-on.md), containing [Neutrino](https://neutrino.js.org/) and [React Chain](https://github.com/aranja/react-chain/) middlewares, to configure the build and render pipeline respectively.

**This is the [documentation](https://tux.js.org/v/v1/) for tux@next, or v1.** Things are still a bit rough. If you have questions, feel free to reach out on [Twitter](https://twitter.com/eirikurn) or [Slack](http://slack.javascript.is/).

[![CircleCI branch](https://img.shields.io/circleci/project/github/aranja/tux/v1.svg)](https://circleci.com/gh/aranja/tux/tree/v1) [![npm](https://img.shields.io/npm/v/tux/next.svg)](https://www.npmjs.com/package/tux) [![Slack channel](https://img.shields.io/badge/slack-%23tux%40jsis-61dafb.svg)](http://slack.javascript.is/)

## Quick start

```bash
npm install --global create-tux-app@next
create-tux-app hello-tux

cd hello-tux/
npm start
```

Then open [http://localhost:5000/](http://localhost:5000/) to see your app.

When you're ready to deploy to production, run `npm run build` to build production bundles, then `npm run serve` to serve those bundles. If you don't need SSR, you can ship `build/static` to your favourite HTTP server.

### What you get

* React app with server side rendering.
* Modern Babel compilation supporting ES modules, last 2 major browser versions \(Node.js 6.9+\), async functions, dynamic imports, JSX and object rest spread syntax.
* Webpack loaders for importing HTML, CSS, images, icons, and fonts.
* Environment variables to detect BROWSER, SERVER and ADMIN builds and remove unused code.
* Automatic and overridable creation of the HTML page using the [React Document](https://www.npmjs.com/package/react-document) component.
* Development:
  * Webpack Dev Server during development.
  * Excellent error handling during development. See stack traces with code snippets in the browser.
  * Hot Module Replacement support with React Hot Loader.
  * Hot reload on server.
* Production
  * Tree-shaking to create smaller bundle.
  * Production-optimised bundles with Babili minification and easy chunking.
  * Use environment variables to remove server dependencies in browser build.
  * Extracted css in production builds.
  * Long term browser caching with automatic cache invalidation.

The following features \(and more\) are just an add-on away, properly configured for SSR.

* React Router v4.
* Async components with code splitting.
* Data fetching.
* React Helmet to configure meta tags for better SEO.
* CSS in JS.
* Integrated admin for headless CMS data.

## How tux works

Your `src/app.js` file defines a series of middlewares that compile and run differently on browser and server. The last middleware usually returns the main app component while previous middlewares wrap it or influence how it is rendered. Here are some examples of things middlewares can do:

* Wrap your app with a Provider component, eg BrowserRouter in the browser and StaticRouter on the server.
* Pre-render the app, eg to fetch data that is needed for initial render.
* Track rendered components, styles and chunks.

Middlewares can add tags to the html [Document](https://github.com/aranja/react-document) on the server. They can also write data into a script tag and use it for the first render in the browser.

## Documentation


## License

MIT

