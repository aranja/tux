import adapter from './adapter'
import routes from './routes'
import router from './middleware/router'
import { createApp } from 'tux'
import admin from 'tux-addon-admin'
import createReactChain from 'react-chain'

import './reset.css'
import './index.css'

const app = createApp()

app.use(admin({ adapter }))

app.use(router(routes))

export default app
