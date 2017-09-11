import QueryApi from './query-api'

export interface Config {
  space: string
  accessToken: string
  host: string
  applicationUid: string
  clientId: string // Deprecated
  redirectUri: string
}

export default class BaseAdapter {
  deliveryApi: QueryApi
  space: string
  applicationUid: string
  redirectUri: string

  constructor(config: Config) {
    this.space = config.space
    this.applicationUid = config.applicationUid || config.clientId
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
