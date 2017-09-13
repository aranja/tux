# Contributing

Thank you for your interest in contributing to Tux! We are still working on this guide, but please stick around and reach out to us in the issues or on Twitter if you have any questions.

## Getting started

Here's a way to quickly get started working in the repo.

```bash
# Install shared dependencies
npm install

# Build all packages for development and watch for changes
npm run watch

# Run example site.
# Currently the content comes from Contentful so the admin is not publicly accessible.
cd packages/tux-example-site && npm start

# Run tests, lint and typescript validation
npm test
npm run lint
npm run check-types
```

Please create issues for major changes and enhancements that you wish to make. Discuss things transparently and get feedback from the community.

## Code review process

Code is reviewed by Tux team members for quality, conformance to existing patterns, and functionality.