import BaseAdapter from './base-adapter'
import QueryApi from './query-api'
import ManagementApi from './management-api'
import generateEditorSchema from './editors'

import { Field, Meta } from 'tux'

const errorMessages = {
  initializeManagementApi: 'Could not initialize management api.',
}

export interface Config {
  space: string
  deliveryToken: string
  clientId: string
  redirectUri: string
}

export interface AdapterInterface {
  create(model: any, type: string): void
  createAsset(): { sys: Object }
  createAssetFromFile(file: File, title: string): Object | null
  createAssetFromUrl(url: string, fileName: string, title: string): Object | null
  currentUser(): any | null
  getMeta(model: string | Object): Meta | null
  getQueryApi(): QueryApi
  load(model: any): any
  loadAsset(model: any): any
  login(): void
  logout(): void
  save(model: any): void
}

export class ContentfulAdapter extends BaseAdapter implements AdapterInterface {
  private clientId: string
  private managementApi: ManagementApi | null
  private redirectUri: string

  constructor({space, deliveryToken, clientId, redirectUri}: Config) {
    super({ space, deliveryToken })

    this.managementApi = null
  }

  async getManagementApi() {
    if (!this.managementApi) {
      await this.initPrivateApis()
    }

    if (this.managementApi) {
      return this.managementApi
    }
    throw new Error(errorMessages.initializeManagementApi)
  }

  private async initPrivateApis() {
    // There is a total of two apis:
    // Content Delivery API - Access Token passed publicly to adapter.
    // Content Management API - Access Token returned from OAuth2 flow and saved in localStorage.
    // localStorage.

    // No private apis on server for now.
    if (typeof window === 'undefined') {
      return
    }

    // Get auth token after login
    if (location.hash.indexOf('#access_token=') === 0) {
      const startOffset = '#access_token='.length
      let accessToken = location.hash.substr(startOffset, location.hash.indexOf('&') - startOffset)
      localStorage.setItem('contentfulManagementToken', accessToken)
      location.hash = ''
    }

    const managementToken = localStorage.getItem('contentfulManagementToken')

    if (!managementToken) {
      return
    }

    this.managementApi = new ManagementApi(this.space, managementToken)
    this.managementApi.deliveryApi = this.deliveryApi
  }

  async getMeta(model: string | Object) {
    const managementApi = await this.getManagementApi()
    const type = this._getModelType(model)
    if (!type) {
      return null
    }

    const typeMeta = await managementApi.getTypeMeta(type)
    const editorSchema = generateEditorSchema(typeMeta)

    return {
      type,
      editorSchema,
      name: typeMeta.name,
    }
  }

  _getModelType(model: any) {
    if (typeof model === 'string') {
      return model
    } else if (model instanceof Object) {
      return model.sys.contentType.sys.id
    }
    return null
  }

  async save(model: any) {
    const managementApi = await this.getManagementApi()
    if (model.sys.id) {
      await managementApi.saveEntry(model)
    } else {
      await managementApi.createModel(model)
    }
  }

  async createAssetFromFile(file: File, title: string) {
    const managementApi = await this.getManagementApi()
    const upload = await managementApi.createUpload(file)

    if (!upload.sys) {
      return null
    }

    const assetBody = {
      fields: {
        title: title,
        file: {
          contentType: file.type,
          fileName: file.name,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: upload.sys.id,
            },
          }
        }
      }
    }

    const asset = await this._createAsset(assetBody, 'upload')
    return this._formatAssetForLinking(asset)
  }

  create(meta: Meta) {
    if (!meta) {
      return null
    }

    return {
      fields: {},
      sys: {
        contentType: {
          sys: {
            id: meta.type
          }
        }
      }
    }
  }

  createAsset(): { sys: Object } {
    return {
      sys: {
        linkType: 'Asset',
        type: 'Link',
        id: null,
      }
    }
  }

  _formatAssetForLinking(asset: any) {
    return {
      sys: {
        id: asset.sys.id,
        linkType: 'Asset',
        type: 'Link',
      }
    }
  }

  async createAssetFromUrl(url: string, fileName: string, title: string) {
    const assetBody = {
      fields: {
        title: title,
        file: {
          contentType: 'image/jpeg',
          fileName,
          upload: url,
        }
      }
    }

    return await this._createAsset(assetBody, 'url')
  }

  async _createAsset(body: any, bodyType: string) {
    const managementApi = await this.getManagementApi()
    return managementApi.createAsset(body)
  }

  async load(model: any) {
    const managementApi = await this.getManagementApi()
    return managementApi.getEntry(model.sys.id)
  }

  async loadAsset(model: any) {
    const managementApi = await this.getManagementApi()
    return managementApi.getAsset(model.sys.id)
  }

  async currentUser() {
    const managementApi = await this.getManagementApi()
    try {
      let [
        user,
        space,
      ] = await Promise.all([
        managementApi.getUser(),
        managementApi.getSpace(),
      ])

      user.space = space
      return user
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return null
      }
      throw error
    }
  }

  async login() {
    location.href = `https://be.contentful.com/oauth/authorize?response_type=token&` +
      `client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=content_management_manage`
  }

  async logout() {

  }
}

export default function createContentfulAdapter(config: Config) {
  return new ContentfulAdapter(config)
}
