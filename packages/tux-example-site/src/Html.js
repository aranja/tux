import React from 'react'
import Document, { Html, Head, Body, Main, Footer } from 'react-document'

/**
 * This component is a template for the HTML file. You can add webfonts, meta tags,
 * or analytics to this file.
 *
 * To begin the development, run `npm start`.
 * To create a static bundle, use `npm run build`.
 * To create a server bundle, use `npm run build-server`.
 *
 * IMPORTANT: This file is compiled and used differently from other modules.
 *
 * -   In development and in static builds, this code is run at build time. It
 *     only receives asset metadata as a prop. Nothing else.
 *
 * -   In server builds, this code evaluates for every request. It may receive
 *     additional route specific props, e.g. a serialized store and meta tags.
 */

export default class extends Document {
  render() {
    const { helmet } = this.props
    return (
      <Html>
        <Head>
          {helmet && [
            helmet.title.toComponent(),
            helmet.meta.toComponent(),
            helmet.link.toComponent(),
          ]}
          <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,400i" rel="stylesheet" />
        </Head>
        <Body>
          <Main />
          <Footer />
        </Body>
      </Html>
    )
  }
}
