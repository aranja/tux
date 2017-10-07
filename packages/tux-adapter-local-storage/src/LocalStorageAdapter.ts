import QuaryApi from './QuaryApi'

export interface Config {
  applicationUid: string
}

export default class LocalStorageAdapter {
  applicationUid: string
  queryApi: QuaryApi

  constructor({ applicationUid }: Config) {
    if (!applicationUid) {
      throw new Error('Missing an id for LocalStorageAdapter')
    }
    this.applicationUid = applicationUid
    this.queryApi = new QuaryApi(applicationUid)
  }

  getQueryApi() {
    return this.queryApi
  }

  create(meta: any) {
    console.log('create', meta)
  }

  createAsset() {}

  logout() {}

  async login() {
    console.log('login')
  }

  async currentUser() {
    return Promise.resolve({
      name: 'Demo User',
      avatarUrl: '',
      space: {
        name: 'foo',
      },
    })
  }

  async createAssetFromFile(file: File, title: string) {}

  async createAssetFromUrl(url: string, fileName: string, title: string) {}

  async getMeta(model: string | Object) {
    console.log('getMeta', model)
  }

  async load(model: any) {
    return model
  }

  async loadAsset(model: any) {}

  async save(model: any) {
    window.localStorage.setItem(
      `${this.applicationUid}/${model.key}`,
      JSON.stringify(model.data)
    )
  }
}
