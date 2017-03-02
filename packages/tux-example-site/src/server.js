import path from 'path'
import express from 'express'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOM from 'react-dom/server'
import UniversalRouter from 'universal-router'
import createMemoryHistory from 'history/createMemoryHistory'
import assets from 'asset-manifest'
import routes from './routes'
import App from './App'
import Html from './Html'

const app = express()

app.use(express.static(path.join(__dirname, 'public'), { index: false }))

/**
 * Server-side rendering middleware
 */
app.get('*', async (req, res, next) => {
  try {
    const api = createApi()
    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      api,
    })

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect)
      return
    }

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      history: createMemoryHistory(req.url),
      userAgent: req.headers['user-agent'],
      data: route.data,
    }

    const data = { ...route }
    data.assets = assets
    data.apiCache = api.getCache()
    data.children = ReactDOM.renderToString(<App context={context}>{route.element}</App>)

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch (err) {
    next(err)
  }
})

/**
 * Error handling
 */
const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)) // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      assets={assets}
    >
      {err.toString()}
    </Html>,
  )
  res.status(err.status || 500)
  res.send(`<!doctype html>${html}`)
})

/**
 * Launch the server
 */
export const port = process.env.PORT || 3000
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`)
  /* eslint-enable no-console */
})
