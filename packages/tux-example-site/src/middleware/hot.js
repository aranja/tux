export default acceptFn => session => {
  if (!process.env.SERVER && module.hot) {
    acceptFn(() => session.refresh())
  }
}
