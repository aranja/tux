import path from 'path'
import express from 'express'
import PrettyError from 'pretty-error'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import assets from 'asset-manifest'
import Html from './Html'
import tux from './tux'
import { createContext } from 'tux/lib/tux'

const app = express()
  
app.use(express.static(path.join(__dirname, 'static'), { index: false }))

/**
 * Server-side rendering middleware
 */
app.get('*', async (req, res, next) => {
  try {
    const context = createContext({
      assets,
      request: req,
      response: res,
    })

    const element = await tux.getElement(context)
    const body = tux.renderServer(context, () => ReactDOMServer.renderToString(element))
    const html = ReactDOMServer.renderToStaticMarkup(
      <Html assets={context.assets} context={{ data: context.data }} {...context.htmlProps}>
        {body}
      </Html>
    )

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
  const html = ReactDOMServer.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      assets={assets}
    >{err.toString()}</Html>
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
