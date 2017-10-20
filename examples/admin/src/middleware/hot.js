export default acceptFn => session => {
  if (process.env.TUX_BUILD_TARGET !== 'server' && module.hot) {
    acceptFn(() => session.refresh())
  }
}
