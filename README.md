# TUX

[![CircleCI](https://circleci.com/gh/aranja/tux.svg?style=svg&circle-token=2d451777f7f436fcbc804480908ddd288253d334)](https://circleci.com/gh/aranja/tux)

> **Note:** tux is in active development and the API is subject to change drastically before it hits version `1.0.0`.

## Get started

```bash
npm install -g tux-cli

tux new my-app
cd my-app/
npm start
```

Then open [http://localhost:5000/](http://localhost:5000/) to see your app.

## Development

```bash
# Install shared dependencies
npm install

# Build packages and watch for changes
npm run watch

# Run example site
cd packages/tux-example-site && npm start
```

### QA

Testing:
```bash
npm test
```

Lint:
```bash
npm run lint
```

### Other

You can access lerna directly with:
```bash
npm run lerna
```

To bootstrap manually, run:
```bash
npm run bootstrap
```
