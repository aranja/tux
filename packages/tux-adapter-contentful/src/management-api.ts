import axios from 'axios'
import {AxiosInstance} from 'axios'

class ManagementApi {
  private client : AxiosInstance
  private space : string

  previewApi : any

  constructor (space : string, accessToken : string) {
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

  get(url : string, params? : Object): Promise<any> {
    return this.client.get(url, { params }).then(result => result.data) as Promise<any>
  }

  put(url : string, body : any, version : string): Promise<any> {
    return this.client.put(url, body, {
      headers: {
        'X-Contentful-Version': version,
      }
    }).then(result => result.data) as Promise<any>
  }

  getEntry(id : string) {
    return this.get(`/spaces/${this.space}/entries/${id}`)
  }

  async saveEntry(entry : any) {
    const { fields, sys: { id, version } } = entry
    const newEntry = await this.put(`/spaces/${this.space}/entries/${id}`, { fields }, version)

    if (this.previewApi) {
      this.previewApi.override(this.formatForDelivery(newEntry))
    }

    return newEntry
  }

  async getTypeMeta(type : string) {
    const [
      contentType,
      editorInterface,
    ] = await Promise.all([
      this.get(`/spaces/${this.space}/content_types/${type}`),
      this.get(`/spaces/${this.space}/content_types/${type}/editor_interface`),
    ])

    contentType.fields.forEach((field : any) => {
      field.control = editorInterface.controls.find((editor : any) => editor.fieldId === field.id)
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

  formatForDelivery(entry : any) {
    Object.keys(entry.fields).forEach(name => {
      const value = entry.fields[name]
      entry.fields[name] = value && value['en-US']
    })
    return entry
  }
}

export default ManagementApi
