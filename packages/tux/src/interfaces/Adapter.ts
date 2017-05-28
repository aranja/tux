import ModelMeta from './ModelMeta'

interface Adapter {
  create(model: any): Object | null
  createAsset(): { sys: Object }
  createAssetFromFile(file: File, title: string): Object | null
  createAssetFromUrl(url: string, fileName: string, title: string): Object | null
  currentUser(): any | null
  getMeta(model: string | Object): Promise<ModelMeta | null>
  getQueryApi(): any
  load(model: any): any
  loadAsset(model: any): any
  login(): void
  logout(): void
  save(model: any): void
}

export default Adapter
