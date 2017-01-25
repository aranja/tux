import adminContentful from './manage'
import QueryApi from './query-api'
import ManagementApi from './management-api'

class ContentfulAdapter {
  constructor({ space, deliveryToken, clientId, redirectUri }) {
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

  addChangeListener(fn) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== fn)
    }
  }

  async initPrivateApis() {
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

  getSchema(model) {
    return this.managementApi.getTypeMeta(model.sys.contentType.sys.id)
  }

  async save(model) {
    const newModel = await this.managementApi.saveEntry(model)
    this.triggerChange()
    return newModel
  }

  load(model) {
    return this.managementApi.getEntry(model.sys.id)
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
    } catch(error) {
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

export default function createContentfulAdapter(options) {
  return new ContentfulAdapter(options)
}
