import axios from 'axios'
import find from 'lodash/find'

class ManagementApi {
  constructor (space, accessToken) {
    this.space = space
    this.previewApi = null
    this.client = axios.create({
      baseURL: `https://api.contentful.com`,
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  get(url, params) {
    return this.client.get(url, { params }).then(result => result.data)
  }

  put(url, body, version) {
    return this.client.put(url, body, {
      headers: {
        'X-Contentful-Version': version,
      }
    }).then(result => result.data)
  }

  getEntry(id) {
    return this.get(`/spaces/${this.space}/entries/${id}`)
  }

  async saveEntry(entry) {
    const { fields, sys: { id, version } } = entry
    const newEntry = await this.put(`/spaces/${this.space}/entries/${id}`, { fields }, version)

    if (this.previewApi) {
      this.previewApi.override(this.formatForDelivery(newEntry))
    }

    return newEntry
  }

  async getTypeMeta(type) {
    const [
      contentType,
      editorInterface,
    ] = await Promise.all([
      this.get(`/spaces/${this.space}/content_types/${type}`),
      this.get(`/spaces/${this.space}/content_types/${type}/editor_interface`),
    ])

    contentType.fields.forEach(field => {
      field.control = find(editorInterface.controls, ['fieldId', field.id])
    })
    return contentType
  }

  async getPreviewToken() {
    const previewApiKeys = await this.get(`/spaces/${this.space}/preview_api_keys`)
    const apiKey = previewApiKeys.items[0]
    return apiKey && apiKey.accessToken
  }

  getUser() {
    return this.get('/user')
  }

  getSpace() {
    return this.get(`/spaces/${this.space}`)
  }

  formatForDelivery(entry) {
    Object.keys(entry.fields).forEach(name => {
      const value = entry.fields[name]
      entry.fields[name] = value && value['en-US']
    })
    return entry
  }
}

export default ManagementApi
