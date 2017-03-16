import QueryApi from './query-api'
import ManagementApi from './management-api'
import generateEditorSchema from './editors'

import { extractLocale, injectLocale, setLocale } from './locale'

import { Field, Meta } from 'tux'

export interface Config {
  space: string
  deliveryToken: string
  clientId: string
  redirectUri: string
}

export interface Field {
  field: string,
  label: string,
  component: any,
  props?: Object
}

export interface Meta {
  type: string,
  editorSchema?: Array<Field>,
  name?: string,
}

export class ContentfulAdapter {
  private space: string
  private clientId: string
  private redirectUri: string
  private deliveryApi: QueryApi
  private listeners: Array<Function>

  constructor({space, deliveryToken, clientId, redirectUri}: Config) {
    this.space = space
    this.clientId = clientId
    this.redirectUri = redirectUri
    this.deliveryApi = new QueryApi(space, deliveryToken, 'cdn')
    this.listeners = []
  }

  getManagementApi() {
    return new Promise(async (resolve, reject) => {
      const managementToken = localStorage.getItem('contentfulManagementToken')
      if (!managementToken) {
        return reject('No valid managementToken found')
      }
      const managementApi = new ManagementApi(this.space, managementToken)
      const defaultLocale = await managementApi.getDefaultLocaleForSpace(this.space)
      setLocale(defaultLocale)
      resolve(managementApi)
    })
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
    // There is a total of three apis:
    // Content Delivery API - Access Token passed publicly to adapter.
    // Content Management API - Access Token returned from OAuth2 flow and saved in localStorage.
    // Content Preview API - Access Token manually queried through Admin API, then saved in
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

    const managementApi = new ManagementApi(this.space, managementToken)

    let previewToken = localStorage.getItem('contentfulPreviewToken')
    let triggerChange = false
    if (!previewToken) {
      previewToken = await managementApi.getPreviewToken()
      if (!previewToken) {
        console.error('Warning: No access token found for Contentful Preview API.')
        return
      }
      triggerChange = true
      localStorage.setItem('contentfulPreviewToken', previewToken)
    }

    const previewApi = new QueryApi(this.space, previewToken, 'preview')
    managementApi.previewApi = previewApi

    if (triggerChange) {
      this.triggerChange()
    }

    return managementApi
  }

  async getQueryApi() {
    await this.initPrivateApis()
    const managementApi = await this.getManagementApi()
    return managementApi.previewApi || this.deliveryApi
  }

  getMeta(model: string | Object): Promise<Meta> {
    return new Promise(async(resolve, reject) => {
      const managementApi = await this.getManagementApi()
      const type = this._getModelType(model)
      if (!type) {
        return reject('Invalid type')
      }

      const typeMeta = await managementApi.getTypeMeta(type)
      const editorSchema = generateEditorSchema(typeMeta)

      resolve({
        type,
        editorSchema,
        name: typeMeta.name,
      })
    })
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

    const modelWithLocale = injectLocale(model)
    await managementApi.saveEntry(modelWithLocale)
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
    const asset = await managementApi.createAsset(injectLocale(body))
    if (asset) {
      await managementApi.processAsset(
        asset.sys.id,
        'en-US',
        asset.sys.version
      )
    }
    return asset
  }

  async load(model: any) {
    const managementApi = await this.getManagementApi()
    const entry = await managementApi.getEntry(model.sys.id)
    return extractLocale(entry)
  }

  async loadAsset(model: any) {
    const managementApi = await this.getManagementApi()
    const asset = await managementApi.getAsset(model.sys.id)
    return extractLocale(asset)
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
