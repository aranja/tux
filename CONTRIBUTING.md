# Contributing

Thank you for your interest in contributing to Tux! We are still working on this guide, but please stick around and reach out to us in the issues or on Twitter if you have any questions.

Before contributing, please read our [code of conduct](CODE_OF_CONDUCT.md).

## Getting started

This is a monorepo containing all tux related packages. It uses [yarn workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) so you need to install the latest version of `yarn` to manage dependencies in this project:

```
npm install --global yarn
```

When `yarn` has been successfully installed, get started developing by running the following scripts:

```bash
# Install shared dependencies
yarn

# Build all packages for development and watch for changes
yarn watch

# Run example site.
cd packages/tux-example-site && yarn start

# Run tests, lint and typescript validation
yarn test
yarn lint
yarn check-types
```

Please create issues for major changes and enhancements that you wish to make. Discuss things transparently and get feedback from the community.

## Code review process

Code is reviewed by Tux team members for quality, conformance to existing patterns, and functionality.
