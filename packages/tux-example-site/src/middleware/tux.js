import React from 'react'
import { TuxProvider } from 'tux'

export const $$api = Symbol('api')

const tux = (options) => {
  const { adapter } = options

  return async (renderChildren, context) => {
    const { refresh } = context
    context[$$api] = context.api = await adapter.getQueryApi()

    const children = await renderChildren()
    return (
      <TuxProvider adapter={adapter} onRefresh={refresh}>
        {children}
      </TuxProvider>
    )
  }
}

export default tux
