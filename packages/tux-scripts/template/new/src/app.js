import React from 'react';
import { tuxMiddleware as tux } from 'tux';
import createContentfulAdapter from 'tux-adapter-contentful';
import history from 'react-chain-history';
import createReactChain from 'react-chain';
import Home from './Home';

import './index.css';

const publicUrl = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL
  : process.env.SERVER
      ? `https://localhost:${process.env.PORT || '5000'}`
      : `${location.protocol}//${location.host}/`;

// Get your Contentful application uid from
// https://app.contentful.com/account/profile/developers/applications
const adapter = createContentfulAdapter({
  space: process.env.TUX_CONTENTFUL_SPACE_ID,
  accessToken: process.env.TUX_CONTENTFUL_ACCESS_TOKEN,
  applicationUid: process.env.TUX_CONTENTFUL_APPLICATION_UID,
  redirectUri: publicUrl,
});

export default createReactChain()
  .chain(history())
  .chain(tux({ adapter }))
  .chain(() => () => <Home />);
