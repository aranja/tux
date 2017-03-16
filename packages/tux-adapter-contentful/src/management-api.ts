import axios from 'axios'
import {AxiosInstance} from 'axios'

let instance: any = null

class ManagementApi {
  private client: AxiosInstance
  private space: string

  previewApi: any

  constructor(space: string, accessToken: string) {
    if (instance) {
      return instance
    } else {
      instance = this
    }

    instance.space = space
    instance.previewApi = null
    instance.client = axios.create({
      baseURL: `https://api.contentful.com`,
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  get(url: string, params?: Object): Promise<any> {
    return instance.client.get(
      url,
      { params }
    ).then(result => result.data) as Promise<any>
  }

  put(url: string, body: any, version: string): Promise<any> {
    return instance.client.put(url, body, {
      headers: {
        'X-Contentful-Version': version,
      }
    }).then(result => result.data) as Promise<any>
  }

  post(url: string, body: any, contentType: string) {
    return instance.client.post(url, body, {
      headers: {
        'Content-Type': contentType,
      }
    }).then(result => result.data) as Promise<any>
  }

  getEntry(id: string) {
    return instance._getEntity(id, 'entries')
  }

  getAsset(id: string) {
    return instance._getEntity(id, 'assets')
  }

  _getEntity(id: string, entityPath: string) {
    return instance.get(`/spaces/${instance.space}/${entityPath}/${id}`)
  }

  async saveEntry(entry: any) {
    return instance._save(entry, 'entries')
  }

  async saveAsset(asset: any) {
    return instance._save(asset, 'assets')
  }

  processAsset(id: string, localeName: string, version: any) {
    const url = `/spaces/${instance.space}/assets/${id}/files/${localeName}/process`
    return instance.put(url, null, version)
  }

  async _save(entity: any, entityPath: string) {
    const { fields, sys: { id, version } } = entity
    const url = `/spaces/${instance.space}/${entityPath}/${id}`
    const newEntry = await instance.put(url, { fields }, version)

    if (instance.previewApi) {
      instance.previewApi.override(instance.formatForDelivery(newEntry))
    }

    return newEntry
  }

  createUpload(file: File) {
    const url = `https://upload.contentful.com/spaces/${instance.space}/uploads`

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('POST', url, true)
      request.setRequestHeader('Content-Type', 'application/octet-stream')
      request.setRequestHeader(
        'Authorization',
        instance.client.defaults.headers.Authorization
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
    const url = `/spaces/${instance.space}/assets`
    return instance.post(url, body, 'application/json')
  }

  async getTypeMeta(type: string) {
    const [
      contentType,
      editorInterface,
    ] = await Promise.all([
      instance.get(`/spaces/${instance.space}/content_types/${type}`),
      instance.get(`/spaces/${instance.space}/content_types/${type}/editor_interface`),
    ])

    contentType.fields.forEach((field: any) => {
      field.control = editorInterface.controls.find((editor: any) => editor.fieldId === field.id)
    })
    return contentType
  }

  async getPreviewToken() {
    const previewApiKeys = await instance.get(`/spaces/${instance.space}/preview_api_keys`)
    const apiKey = previewApiKeys.items[0]
    return apiKey && apiKey.accessToken
  }

  getUser() {
    return instance.get('/user')
  }

  getSpace() {
    return instance.get(`/spaces/${instance.space}`)
  }

  getLocalesForSpace(spaceId: string) {
    return instance.get(`/spaces/${instance.space}/locales`)
  }

  async getDefaultLocaleForSpace(spaceId: string) {
    return new Promise(async(resolve, reject) => {
      if (instance.defaultLocale) {
        return resolve(instance.defaultLocale)
      }

      const locales = await instance.getLocalesForSpace(spaceId)
      for (const locale of locales.items) {
        if (locale.default) {
          instance.defaultLocale = locale.internal_code
          return resolve(instance.defaultLocale)
        }
      }
      return reject('No default locale found')
    })
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
