import QueryApi from './query-api'

export interface Config {
  space: string
  deliveryToken: string
}

export default class BaseAdapter {
  deliveryApi: QueryApi
  space: string

  constructor({space, deliveryToken}: Config) {
    this.space = space
    this.deliveryApi = new QueryApi(space, deliveryToken, 'cdn')
    this.listeners = []
  }

  async currentUser() {
    return null
  }

  getQueryApi() {
    return this.deliveryApi
  }
}
