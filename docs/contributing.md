# Contributing

Thank you for your interest in contributing to Tux! We are still working on this guide, but please stick around and reach out to us in the issues or on Twitter if you have any questions.

## Development

Here's a way to quickly get started working in the repo.

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

## 

## Code review process

Code is reviewed by Tux team members for quality, conformance to existing patterns, and functionality.