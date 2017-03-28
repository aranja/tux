import QueryApi from './query-api'
import ManagementApi from './management-api'
import generateEditorSchema from './editors'

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

  triggerChange() {
    this.listeners.forEach(fn => fn())
  }

  addChangeListener(fn: Function) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== fn)
    }
  }

  getQueryApi() {
    return this.deliveryApi
  }
}
