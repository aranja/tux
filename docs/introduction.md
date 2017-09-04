# Introduction

There are three parts to creating a great content-driven website with React and Tux.

* [Build setup](#build-setup)
* [Rendering](#rendering)
* [Fetching data](#fetching-data)

## Build setup

Tux uses [Webpack](https://webpack.js.org/) to bundle your website for the browser as well as server rendering. Configuration is done with [Neutrino](https://neutrino.js.org/).

The default Tux preset builds on top of the official [Web](https://neutrino.js.org/presets/neutrino-preset-web/), [React](https://neutrino.js.org/presets/neutrino-preset-react/) and [Node](https://neutrino.js.org/presets/neutrino-preset-node/) presets, who's features are repeated here for your convenience:

* Modern Babel compilation supporting ES modules, last 2 major browser versions \(Node.js 6.9+\), async functions, dynamic imports, JSX and object rest spread syntax.
* Webpack loaders for importing HTML, CSS, images, icons, and fonts.
* Webpack Dev Server during development.
* Hot Module Replacement support with React Hot Loader.
* Tree-shaking to create smaller bundle.
* Production-optimized bundles with Babili minification and easy chunking.

On top of this, Tux adds:

* Extract css in production builds
* Environment variables to detect BROWSER, SERVER and ADMIN builds and remove unused code.
* Automatic creation of HTML pages using a [React Document](https://www.npmjs.com/package/react-document) component.

Tux supports additional Neutrino presets in `.neutrinorc.js`.

```json
module.exports = {
  use: [
    "tux/neutrino",
    "tux-admin/neutrino",
    "tux-something/neutrino",
  ],
}
```

## Rendering

Coming soon.

## Fetching data

Coming soon.

