import { createReactChain } from 'react-chain'

export const createApp = () => {
  const app = createReactChain()
  app.use(document)
  return app
}
