# TUX 

[![CircleCI](https://circleci.com/gh/aranja/tux-next.svg?style=svg&circle-token=2d451777f7f436fcbc804480908ddd288253d334)](https://circleci.com/gh/aranja/tux-next)

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

To bootstreap manually, run:
```bash
npm run bootstrap
```
