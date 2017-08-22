import { TuxContext, Adapter } from '../interfaces'

export class MockContext implements TuxContext {
  adapter = new MockAdapter()
  isEditing = false

  async editModel(model: any) {
    return false
  }
}

export class MockAdapter implements Adapter {
  create(model: any) {
    return null
  }
  createAsset() {
    return null
  }
  createAssetFromFile(file: File, title: string) {
    return null
  }
  createAssetFromUrl(url: string, fileName: string, title: string) {
    return null
  }
  currentUser() {
    return null
  }
  async getMeta(model: string | Object) {
    return null
  }
  getQueryApi() {
    return null
  }
  load(model: any) {
    return null
  }
  loadAsset(model: any) {
    return null
  }
  login() {}
  logout() {}
  save(model: any) {}
}
