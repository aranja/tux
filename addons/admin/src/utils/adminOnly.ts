export default (fnName: string) => () => {
  const error = new Error(`Can\'t use ${fnName} in production.`)
  error.name = 'Incorrect Tux Build'
  error.framesToPop = 1 // we don't care about this frame
  throw error
}
