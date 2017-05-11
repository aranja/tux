import React from 'react';
import createContentfulAdapter from 'tux-adapter-contentful';
import tux from './middleware/tux';
import history from 'react-chain-history';
import createReactChain from 'react-chain';
import Home from './Home';

import './index.css';

const publicUrl = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL
  : process.env.SERVER
      ? 'https://localhost:3000'
      : `${location.protocol}//${location.host}/`;

// Get your Contentful clientId (application Uid) from https://app.contentful.com/account/profile/developers/applications
const adapter = createContentfulAdapter({
  space: process.env.TUX_CONTENTFUL_SPACE_ID,
  accessToken: process.env.TUX_CONTENTFUL_ACCESS_TOKEN,
  clientId: process.env.TUX_CONTENTFUL_CLIENT_ID,
  redirectUri: publicUrl,
});

export default createReactChain()
  .chain(history())
  .chain(tux({adapter}))
  .chain(() => () => <Home />);
