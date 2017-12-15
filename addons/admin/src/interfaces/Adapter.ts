import ModelMeta from './ModelMeta'

interface Adapter {
  create(model: any): object | null
  createAsset(): { sys: object } | null
  createAssetFromFile(file: File, title: string): object | null
  createAssetFromUrl(
    url: string,
    fileName: string,
    title: string
  ): object | null
  currentUser(): any | null
  getMeta(model: string | object): Promise<ModelMeta | null>
  getQueryApi(): any
  load(model: any): any
  loadAsset(model: any): any
  login(): void
  logout(): void
  save(model: any): void
}

export default Adapter
