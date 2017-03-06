import axios from 'axios'
import {AxiosInstance} from 'axios'

class ManagementApi {
  private client: AxiosInstance
  private space: string

  previewApi: any

  constructor (space: string, accessToken: string) {
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

  get(url: string, params?: Object): Promise<any> {
    return this.client.get(
      url,
      { params }
    ).then(result => result.data) as Promise<any>
  }

  put(url: string, body: any, version: string): Promise<any> {
    return this.client.put(url, body, {
      headers: {
        'X-Contentful-Version': version,
      }
    }).then(result => result.data) as Promise<any>
  }

  post(url: string, body: any, contentType: string) {
    return this.client.post(url, body, {
      headers: {
        'Content-Type': contentType,
      }
    }).then(result => result.data) as Promise<any>
  }

  getEntry(id: string) {
    return this._getEntity(id, 'entries')
  }

  getAsset(id: string) {
    return this._getEntity(id, 'assets')
  }

  _getEntity(id: string, entityPath: string) {
    return this.get(`/spaces/${this.space}/${entityPath}/${id}`)
  }

  async saveEntry(entry: any) {
    return this._save(entry, 'entries')
  }

  async saveAsset(asset: any) {
    return this._save(asset, 'assets')
  }

  processAsset(id: string, localeName: string, version: any) {
    const url = `/spaces/${this.space}/assets/${id}/files/${localeName}/process`
    return this.put(url, null, version)
  }

  async _save(entity: any, entityPath: string) {
    const { fields, sys: { id, version } } = entity
    const url = `/spaces/${this.space}/${entityPath}/${id}`
    const newEntry = await this.put(url, { fields }, version)

    if (this.previewApi) {
      this.previewApi.override(this.formatForDelivery(newEntry))
    }

    return newEntry
  }

  createUpload(file: File) {
    const url = `https://upload.contentful.com/spaces/${this.space}/uploads`

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('POST', url, true)
      request.setRequestHeader('Content-Type', 'application/octet-stream')
      request.setRequestHeader(
        'Authorization',
        this.client.defaults.headers.Authorization
      )
      request.onload = () => {
        const data = JSON.parse(request.response)
        resolve(data)
      }

      request.onerror = () => {
        reject('Could not create upload')
      }

      request.send(file)
    })
  }

  createAsset(body: any) {
    const url = `/spaces/${this.space}/assets`
    return this.post(url, body, 'application/json')
  }

  async getTypeMeta(type: string) {
    const [
      contentType,
      editorInterface,
    ] = await Promise.all([
      this.get(`/spaces/${this.space}/content_types/${type}`),
      this.get(`/spaces/${this.space}/content_types/${type}/editor_interface`),
    ])

    contentType.fields.forEach((field: any) => {
      field.control = editorInterface.controls.find((editor: any) => editor.fieldId === field.id)
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

  formatForDelivery(entry: any) {
    Object.keys(entry.fields).forEach(name => {
      const value = entry.fields[name]
      entry.fields[name] = value && value['en-US']
    })
    return entry
  }
}

export default ManagementApi
