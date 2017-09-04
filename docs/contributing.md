## Development

Here's a way to quickly get started.

```bash
# Install shared dependencies
npm install

# Build all packages for development and watch for changes
npm run watch

# Run example site.
# Currently the data comes from Contentful and the admin is not accessible.
cd packages/tux-example-site && npm start

# Run tests, lint and typescript validation
npm test
npm run lint
npm run check-types
```



