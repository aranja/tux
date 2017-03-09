import React from 'react'
import ReactDOM from 'react-dom'
import { createContext } from 'tux/lib/tux'
import tux from './tux'

const container = document.getElementById('root')
const context = createContext()

context.refresh = async () => {
  const element = await tux.getElement(context)
  return await tux.renderClient(context, () => {
    ReactDOM.render(element, container)
  })
}

context.refresh().then(() => {
  if (window.ga) {
    window.ga('send', 'pageview', location.pathname)
  }
})
