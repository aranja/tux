<img height="250" alt="Tux logo" src="https://cloud.githubusercontent.com/assets/8494120/25946962/d72545b2-363c-11e7-9fee-9de03aa06b6a.png">

Create content-driven websites with React.

Tux allows you to focus on building the website by taking care of Webpack, SSR and performance.

If your website is fetching content from an api-driven CMS like Contentful, Tux has an integrated admin where the content can be edited inline.

> **Note:** This is v0 of tux, check out the [early release of v1](https://tux.js.org/v/v1/).

[![CircleCI branch](https://img.shields.io/circleci/project/github/aranja/tux/master.svg)](https://circleci.com/gh/aranja/tux) [![npm](https://img.shields.io/npm/v/tux.svg)](https://www.npmjs.com/package/tux) [![Slack channel](https://img.shields.io/badge/slack-%23tux%20%40%20jsis-61dafb.svg)](http://jsis-slackin.herokuapp.com/)

## Get started

```bash
npm install -g tux-cli

tux new my-app
cd my-app/
npm start
```

Then open [http://localhost:5000/](http://localhost:5000/) to see your app.

## Documentation

First read the [introduction](/docs/introduction.md). Then take a look at [the example site](/packages/tux-example-site/).

## Development

```bash
# Install shared dependencies
npm install

# Build packages for development and watch for changes
npm run watch

# Run example site.
# Note that currently, the admin is 
cd packages/tux-example-site && npm start

# Run tests
npm test

# Lint
npm run lint
```

## License

MIT
