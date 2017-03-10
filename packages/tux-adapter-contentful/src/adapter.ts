import QueryApi from './query-api'
import ManagementApi from './management-api'
import widgetIdToEditor from './widget-to-editor'

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
  private previewApi: any
  private managementApi: ManagementApi | null
  private listeners: Array<Function>

  constructor({space, deliveryToken, clientId, redirectUri}: Config) {
    this.space = space
    this.clientId = clientId
    this.redirectUri = redirectUri
    this.deliveryApi = new QueryApi(space, deliveryToken, 'cdn')
    this.previewApi = null
    this.managementApi = null
    this.listeners = []
    this.initPrivateApis()
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

    let previewToken = localStorage.getItem('contentfulPreviewToken')
    let triggerChange = false
    if (!previewToken) {
      previewToken = await this.managementApi.getPreviewToken()
      if (!previewToken) {
        console.error('Warning: No access token found for Contentful Preview API.')
        return
      }
      triggerChange = true
      localStorage.setItem('contentfulPreviewToken', previewToken)
    }

    this.previewApi = new QueryApi(this.space, previewToken, 'preview')
    this.managementApi.previewApi = this.previewApi

    if (triggerChange) {
      this.triggerChange()
    }
  }

  getQueryApi() {
    return this.previewApi || this.deliveryApi
  }

  getSchema(model: any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in get a scheme.')
    }
    return this.managementApi.getTypeMeta(model.sys.contentType.sys.id)
  }

  getMeta(model: string | Object): Promise<Meta> {
    return new Promise(async(resolve, reject) => {
      if (!this.managementApi) {
        return reject('Manager api not defined, please log in get a scheme.')
      }

      const type = this._getModelType(model)
      if (!type) {
        return reject('Invalid type')
      }

      const typeMeta = await this.managementApi.getTypeMeta(type)
      console.log(typeMeta)
      const editorSchema = this.transformTypeMetaToEditorSchema(typeMeta)
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
    } else if (typeof model === 'object') {
      return model.sys.contentType.sys.id
    }
    return null
  }

  transformTypeMetaToEditorSchema(typeMeta: any) {
    return typeMeta.fields.map(this.transformTypeMetaFieldToEditorField)
  }

  transformTypeMetaFieldToEditorField(typeMetaField: any) {
    return {
      field: typeMetaField.id,
      label: typeMetaField.name,
      component: widgetIdToEditor[typeMetaField.control.widgetId]
    }
  }

  async save(model: any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in to save.')
    }

    await this.managementApi.saveEntry(model)
    this.triggerChange()
  }

  async createAssetFromFile(file: any, title: string) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in to save.')
    }

    const upload = await this.managementApi.createUpload(file)
    if (upload.sys) {
      const localeName = 'en-US'
      const assetBody = {
        fields: {
          title: {
            [localeName]: title,
          },
          file: {
            [localeName]: {
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
      }

      return await this._createAsset(assetBody, 'upload')
    }
    return null
  }

  async createAssetFromUrl(url: string, fileName: string, localeName: string, title: string) {
    const assetBody = {
      fields: {
        title: {
          [localeName]: title
        },
        file: {
          [localeName]: {
            contentType: 'image/jpeg',
            fileName,
            upload: url,
          }
        }
      }
    }

    return await this._createAsset(assetBody, 'url')
  }

  async _createAsset(body: any, bodyType: string) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in to save.')
    }

    const asset = await this.managementApi.createAsset(body)
    if (asset) {
      await this.managementApi.processAsset(
        asset.sys.id,
        'en-US',
        asset.sys.version
      )
    }
    return asset
  }

  async load(model: any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in get a scheme.')
    }

    return this.managementApi.getEntry(model.sys.id)
  }

  loadAsset(model: any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in get a scheme.')
    }
    return this.managementApi.getAsset(model.sys.id)
  }

  async currentUser() {
    if (!this.managementApi) {
      return null
    }

    try {
      let [
        user,
        space,
      ] = await Promise.all([
        this.managementApi.getUser(),
        this.managementApi.getSpace(),
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
