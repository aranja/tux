import React from 'react'
import { createApp } from 'tux'
import admin from 'tux-addon-admin'
import createLocalStorageAdapter from 'tux-adapter-local-storage'
import Home from './Home'

const app = createApp()

app.use(
  admin({
    adapter: createLocalStorageAdapter({
      applicationUid: 'tux-demo-adapter',
    }),
  })
)

app.use(<Home />)

export default app
