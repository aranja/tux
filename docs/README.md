# TUX

Create content-driven React websites with SSR and a plug-and-play configuration.

Tux uses add-ons, containing [Neutrino](https://neutrino.js.org/) and [React Chain](https://github.com/aranja/react-chain/) middlewares, to configure the build and render pipeline respectively.

If your website is fetching content from an api-driven CMS like Contentful, Tux has a pluggable admin allowing the content to be edited inline.

> **Note:** Tux is in active development and the API is subject to change drastically before it hits version `1.0.0`.

[![CircleCI branch](https://img.shields.io/circleci/project/github/aranja/tux/master.svg)](https://circleci.com/gh/aranja/tux) [![npm](https://img.shields.io/npm/v/tux.svg)](https://www.npmjs.com/package/tux) [![Slack channel](https://img.shields.io/badge/slack-%23tux %40 jsis-61dafb.svg)](http://jsis-slackin.herokuapp.com/)

## Quick start

```bash
npm install --global create-tux-app
create-tux-app hello-tux
# or: yarn create tux-app hello-tux

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

## Installing add-ons

Add-ons serve to integrate different tools and libraries into Tux. Each add-on has specific instructions, but usually they amount to these steps:

### 1. Install

Use npm to install the add-on as well as any peer dependencies.

```bash
npm install --save @tux/styled-components styled-components
```

### 2. Add rendering middleware

If the add-on provides a rendering middleware, then add it to `src/app.js`. The order usually does not matter but read the documentation to be sure.

```javascript
import { createApp } from 'tux'
import styledComponents from '@tux/styled-components'

export default createApp()
    .chain(styledComponents())
```

These middlewares can wrap your application element, eg in a Provider component to provide [context](https://facebook.github.io/react/docs/context.html). They can also wrap the actual rendering, eg for sharing data between server and browser rendering. Check out [react-chain](https://github.com/aranja/react-chain/) for more details.

### 3. Add build middleware

If the add-on provides a build middleware, then add it to `.neutrinorc.js`.

```javascript
module.exports = {
  use: [
    ["tux/neutrino", {}],
    "@tux/styled-components/neutrino",
  ],
}
```

These are Neutrino middlewares that modify the webpack config. They can customize the build for different environments, e.g. dev/prod and browser/server.

## Documentation

First read the [introduction](/docs/introduction.md). Then take a look at [the example site](/packages/tux-example-site/).

## License

MIT

