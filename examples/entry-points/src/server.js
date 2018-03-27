import { serve, buildAssets } from 'tux/server'
import Document from 'react-document'
import app from './app'

export default ({ clientStats }) => {
  console.log('Hi from server process')

  return serve({
    Document,
    assets: buildAssets(clientStats),
    app,
  })
}
