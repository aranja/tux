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

export class ContentfulAdapter extends BaseAdapter {
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

  triggerChange() {
    this.listeners.forEach(fn => fn())
  }

  addChangeListener(fn: Function) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== fn)
    }
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
    await managementApi.saveEntry(model)
    this.triggerChange()
  }

  async createAssetFromFile(file: any, title: string) {
    const managementApi = await this.getManagementApi()
    const upload = await managementApi.createUpload(file)
    if (upload.sys) {
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

      return await this._createAsset(assetBody, 'upload')
    }
    return null
  }

  async create(model: any, type: string) {
    const managementApi = await this.getManagementApi()
    await managementApi.createModel(model, type)
    this.triggerChange()
  }

  async createEmptyModel(model: any, meta: Meta) {
    const type = this._getModelType(model)
    if (!meta) {
      return null
    }

    const newModel = {
      fields: {},
      sys: {
        contentType: {
          sys: {
            id: type
          }
        }
      }
    }

    return newModel
  }

  async createEmptyAsset() {
    return {
      sys: {
        linkType: 'Asset',
        type: 'Link',
        id: null,
      }
    }
  }

  formatAssetForLinking(asset: any) {
    return {
      sys: {
        id: asset.sys.id,
        linkType: 'Asset',
        type: 'Link',
      }
    }
  }

  getIdOfEntity(entity: any) {
    if (!entity.sys) {
      return null
    }
    return entity.sys.id
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
