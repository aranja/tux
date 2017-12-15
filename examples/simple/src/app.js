import React from 'react'
import { createApp } from 'tux'
import Home from './Home'

const app = createApp()

// Serve Home component on client and server.
app.use(<Home />)

export default app
