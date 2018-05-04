import React from 'react'
import { createApp } from 'tux'
import Page from './Page'
import reactRouter from 'tux-addon-react-router'
import './index.css'

// Create a Tux app.
const app = createApp()

// Add middlewares for functionality that needs special handling on client and server.
app.use(reactRouter())

// Lastly, serve a component on client and server.
app.use(<Page />)

export default app
