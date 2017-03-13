# Introduction

## What is Tux?

Tux is a open source framework that allows us, as developers, to hand over **ReactJS-powered**, **server rendered**, web applications to our customers while still giving them the freedom over their content as if they were using a familiar content management system (CMS) like Wordpress or Contentful.

Tux does this via _Adapters_ and out-of-the-box Tux offers adapters for Contentful and {{CMS}}.

See it in action by checking out our [demo video]({{video_url}}) or by installing Tux and playing around with the demo page.

## Features

* Inline editing
* Server rendering
* Hot Module Replacement
* Staging and production modes
* Bring your own dependencies

## Adapters

Adapters are Tux's way of communicating with different CMS. To do this securely the [Tux Management API]({{management-api}}) maintains a OAuth2 connection with the CMS.

```javascript
// An example, using the default Contentful adapter
import createContentfulAdapter from 'tux-adapter-contentful'
import { TuxProvider } from 'tux'

const adapter = createContentfulAdapter({
  space: 'space_here',
  deliveryToken: 'token_here',
  clientId: 'client_id_here',
  redirectUri: process.env.PUBLIC_URL || `${location.protocol}//${location.host}/`
})

<TuxProvider adapter={adapter}>
  <App />
</TuxProvider>
```

## Introducing Editable

The `<Editable />` component is the heart of Tux. It takes in a single prop, a Tux [model]({{model}}), which maps its fields to CMS entries and makes them inline editable.

```javascript
const SimpleTextItem = ({ textItem }) => (
  <Editable model={textItem}>
    <h1>{textItem.heading}</h1>
    <p>{textItem.text}</p>
  </Editable>
)  
```

The Editable component can be extended to suit your application's needs.

## Custom editors

Tux provides default editors for all content types (e.g. markdown editor for text areas, date picker for date fields), but these editors can easily be tweaked or replaced.

```javascript
class MyCustomDateEditor extends Component {
  render() {
    const { value, onChange } = this.props.field
    return (
      <TextField value={value} onChange={onChange} />
    )
  }
}
```

## Custom dependencies

It should be easy for developers to bring their dependencies, like a router or a state container, into their Tux setup without complicating server rendering. To solve this we built [react-middleware]{{react-middlewere}}.

```javascript
import tux, { startClient } from 'tux'

tux.use(redux())
tux.use(router(routes))
startClient(tux)
```
