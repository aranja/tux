import React from 'react';
import { createApp } from 'tux';
import admin from 'tux-addon-admin';
import createContentfulAdapter from 'tux-adapter-contentful';
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

const app = createApp();
app.use(admin({ adapter }))
app.use(<Home />);

export default app
