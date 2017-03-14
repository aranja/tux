const hotSymbol = Symbol('hot')

const hot = (acceptFn) => async (renderChildren, context) => {
  const { refresh, [hotSymbol]: alreadyHot } = context
  if (!process.env.SERVER && module.hot && !alreadyHot) {
    context[hotSymbol] = true
    acceptFn(() => refresh())
  }

  return await renderChildren()
}

export default hot
