# Tux React Router Add-on

[![](https://img.shields.io/npm/v/tux-addon-react-router.svg)](https://npmjs.org/package/tux-addon-react-router) [![](https://img.shields.io/npm/dt/tux-addon-react-router.svg)](https://npmjs.org/package/tux-addon-react-router)

`tux-addon-react-router` is a Tux add-on for integrating [React Router v4](https://reacttraining.com/react-router/).

## Requirements

* Node.js v6.10+
* Yarn or npm client
* Tux

## Installation

`tux-addon-react-router` can be installed, along with `react-router-dom`, via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add tux-addon-react-router react-router-dom@4
```

#### npm

```bash
❯ npm install --save tux-addon-react-router react-router-dom@4
```

### Render middleware

`tux-addon-react-router` has a render middleware that wraps the app in `BrowserRouter` and `StaticRouter`, in the browser and the server respectively.  Require this package and plug it into `src/app.js`:

```js
import router from 'tux-addon-react-router'

app.use(router())
```

The order does not matter but usually the router is right before the App component.

```js
// Passing props to the Router.
app.use(router({
  basename: '/calendar',
  getUserConfirmation: (message, callback) => {
    const allowTransition = window.confirm(message)
    callback(allowTransition)
  },
  forceRefresh: false,
  keyLength: 6,
})

// Replace component construction.
app.use(router({
  browserRouter: props => <HashRouter {...props} hashType="noslash" />,
  serverRouter: MemoryRouter,
})
```

#### browserRouter: ReactType

The router component which should be used in the browser.

#### serverRouter: ReactType

The router component which should be used on the server.

#### ...props: any

All options except browserRouter and serverRouter are passed as props to the routers. See the [react-router-dom docs](https://reacttraining.com/react-router/web) docs for more details.

### Build middleware

There's no build middleware in this add-on.

## Usage

That's it! Just use React Router like normal.

On the server, if you set `context.status` and `context.url` \(eg using `<Redirect />`\), the response will be updated with a status code and a redirect respectively.

## Contributing

This add-on is part of the [tux](https://github.com/aranja/tux) monorepo. Follow the [contributing guide](/contributing.md) for details.

\[peer-url\]: [https://reacttraining.com/react-router/](https://reacttraining.com/react-router/)

