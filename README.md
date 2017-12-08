<img height="250" alt="Tux logo" src="https://cloud.githubusercontent.com/assets/8494120/25946962/d72545b2-363c-11e7-9fee-9de03aa06b6a.png">

Create content-driven websites with React.

Tux allows you to focus on building the website by taking care of Webpack, SSR and performance.

If your website is fetching content from an api-driven CMS like Contentful, Tux has an integrated admin where the content can be edited inline.

**This is the documentation for tux@next, or v1.** Things are a bit rough right now. If you have questions, try reaching out on slack.

[![CircleCI branch](https://img.shields.io/circleci/project/github/aranja/tux/v1.svg)](https://circleci.com/gh/aranja/tux/tree/v1) [![npm](https://img.shields.io/npm/v/tux/next.svg)](https://www.npmjs.com/package/tux) [![Slack channel](https://img.shields.io/badge/slack-%23tux%20%40%20jsis-61dafb.svg)](http://slack.javascript.is/)

## Get started

```bash
npm install -g create-tux-app@next

create-tux-app my-app
cd my-app/
npm start
```

Then open [http://localhost:5000/](http://localhost:5000/) to see your app.

## Documentation

First read the [introduction](/docs/introduction.md). Then take a look at [the example site](/packages/tux-example-site/).

## Development

```bash
# Install shared dependencies
yarn

# Build packages for development and watch for changes
yarn watch

# Run an example site.
cd examples/simple && yarn start

# Run tests
yarn test

# Lint
yarn lint
```

## License

MIT
