# TUX

Create content-driven React websites with SSR and a plug-and-play configuration.

Tux uses [Neutrino](https://neutrino.js.org/) and [React Chain](https://github.com/aranja/react-chain/) middlewares to configure the build and render pipeline.

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

When you're ready to deploy to production, run `npm run build` to build production bundles, then `npm run serve` to serve those bundles. If you don't need SSR, you can ship `build/static` to your favorite HTTP server.

### What you get



## Documentation

First read the [introduction](/docs/introduction.md). Then take a look at [the example site](/packages/tux-example-site/).

## License

MIT

