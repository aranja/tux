export default class QueryApi {
  private namespace: string

  constructor(namespace: string) {
    this.namespace = namespace
  }

  async getEntries(params?: Object) {
    return []
  }

  async getEntry(id: string) {
    return this.get(id)
  }

  private get(key: string): Object | null {
    const item = window.localStorage.getItem(`${this.namespace}/${key}`)

    return {
      key,
      data: item && JSON.parse(item),
    }
  }
}
