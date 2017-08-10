import QueryApi from './query-api'

export interface Config {
  space: string
  accessToken: string
  host: string
  clientId: string
  redirectUri: string
}

export default class BaseAdapter {
  deliveryApi: QueryApi
  space: string
  clientId: string
  redirectUri: string

  constructor(config: Config) {
    this.space = config.space
    this.clientId = config.clientId
    this.redirectUri = config.redirectUri
    this.deliveryApi = QueryApi.create(
      config.space,
      config.accessToken,
      config.host
    )
  }

  async currentUser() {
    return null
  }

  getQueryApi() {
    return this.deliveryApi
  }
}
