```bash
# Install lerna (monorepo package manager)
npm install --global lerna

# Install shared dependencies
npm install

# Install package dependencies and link together
lerna bootstrap

# Build packages and watch for changes
lerna run watch

# Run example site
cd packages/tux-example-site && npm start
```
