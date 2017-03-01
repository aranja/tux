import QueryApi from './query-api'
import ManagementApi from './management-api'

interface Config {
  space : string
  deliveryToken : string
  clientId : string
  redirectUri : string
}

class ContentfulAdapter {
  private space : string
  private clientId : string
  private redirectUri : string
  private deliveryApi : QueryApi
  private previewApi : any
  private managementApi : ManagementApi | null
  private listeners : Array<Function>

  constructor({space, deliveryToken, clientId, redirectUri} : Config) {
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

  addChangeListener(fn : Function) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== fn)
    }
  }

  private async initPrivateApis() {
    // There is a total of three apis:
    // Content Delivery API - Access Token passed publicly to adapter.
    // Content Management API - Access Token returned from OAuth2 flow and saved in localStorage.
    // Content Preview API - Access Token manually queried through Admin API, then saved in localStorage.

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

  getSchema(model : any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in get a scheme.')
    }
    return this.managementApi.getTypeMeta(model.sys.contentType.sys.id)
  }

  async save(model : any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in to save.')
    }
    // const newModel = await this.managementApi.saveEntry(model)
    // this.triggerChange()
    // return newModel
    console.log('Looking for assets to save ...')
    console.log(model)
    if (model.fields) {
      await this._saveAssets(model.fields)
    }
    console.log('Done')
    return
  }

  async _saveAssets(fields : any) {
    console.log('saveAssets: enter')
    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName]
      console.log(`Looking at ${fieldName}`)
      let foundAssets = false
      for (const localeName of Object.keys(field)) {
        console.log(`Locale: ${localeName}`)
        const locale = field[localeName]
        if (locale.sys) {
          console.log(`Found a sys property`)
          if (locale.fields) {
            console.log('Had fields, saving asset')
            if (!locale.sys.version) {
              console.log('setting version')
              locale.sys.version = 2
            }
            await this.managementApi.saveAsset({
              fields: {
                file: {
                  [localeName]: locale.fields
                }
              },
              sys: locale.sys,
            })
            foundAssets = true
          }
        }
      }

      if (foundAssets) {
        delete fields[fieldName]
      }
    }
  }

  async load(model : any) {
    if (!this.managementApi) {
      throw new Error('Manager api not defined, please log in get a scheme.')
    }
    const entry = await this.managementApi.getEntry(model.sys.id)
    await this._loadAssetsForEntry(entry.fields)
    return entry
  }

  async _loadAssetsForEntry(fields : any) {
    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName]
      let foundAssets = false
      for (const localeName of Object.keys(field)) {
        const locale = field[localeName]
        if (locale.sys) {
          if (locale.sys.type === 'Link') {
            const loadedAsset = await this.managementApi.getAsset(locale.sys.id)
            locale.sys.version = loadedAsset.sys.version
          }
        }
      }
    }
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
    const loginUrl = `https://be.contentful.com/oauth/authorize?response_type=token&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=content_management_manage`
    location.href = loginUrl
  }

  async logout() {

  }
}

export default function createContentfulAdapter(config : Config) {
  return new ContentfulAdapter(config)
}
