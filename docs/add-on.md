# Add-ons

Add-ons serve to integrate different tools and libraries into Tux. They provide build and render middlewares, which tux feeds into Neutrino and React Chain respectively.

Each add-on has specific instructions, but usually they amount to these steps:

### 1. Install

Use npm to install the add-on as well as any peer dependencies.

```bash
npm install --save tux-addon-styled-components styled-components
```

### 2. Add rendering middleware

If the add-on provides a rendering middleware, then add it to `src/app.js`. The order usually does not matter but read the documentation to be sure.

```javascript
import { createApp } from 'tux'
import styledComponents from 'tux-addon-styled-components'

export default createApp()
    .chain(styledComponents())
```

These middlewares can wrap your application element, eg in a Provider component to provide [context](https://facebook.github.io/react/docs/context.html). They can also wrap the actual rendering, eg for sharing data between server and browser rendering. Check out [react-chain](https://github.com/aranja/react-chain/) for more details.

### 3. Add build middleware

If the add-on provides a build middleware, then add it to `.neutrinorc.js`.

```javascript
module.exports = {
  use: [
    ["tux/neutrino", {}],
    "tux-addon-styled-components/neutrino",
  ],
}
```

These are Neutrino middlewares that modify the webpack config. They customize the build for different environments, e.g. dev vs prod and browser vs server.

