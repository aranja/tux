import QueryApi from './query-api'

export interface Config {
  space: string
  deliveryToken: string
}

export default class BaseAdapter {
  private space: string
  private deliveryApi: QueryApi
  private listeners: Array<Function>

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
