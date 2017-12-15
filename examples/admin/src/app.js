import adapter from './adapter'
import routes from './routes'
import router from './middleware/router'
import history from './middleware/history'
import { createApp } from 'tux'
import admin from 'tux-addon-admin'
import helmet from 'tux-addon-helmet'

import './reset.css'
import './index.css'

const app = createApp()

app.use(admin({ adapter }))
app.use(history())
app.use(helmet())
app.use(router(routes))

export default app
