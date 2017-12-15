import React from 'react'
import { createApp } from 'tux'
import Home from './Home'
import './index.css'

// Create a Tux app.
const app = createApp()

// Add middlewares for functionality that needs special handling on client and server.
// app.use(helmet())
// app.use(reactRouter())

// Lastly, serve a component on client and server.
app.use(<Home />)

export default app
