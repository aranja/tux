import axios from 'axios'
import { AxiosInstance } from 'axios'

// TODO: Fill in
export interface ContentfulJsonItem {
  sys: {
    id: string,
    updatedAt: string,
    contentType: {
      sys: {
        id: string
      }
    }
  }
  fields: any,
}
export interface ContentfulJsonEntry extends ContentfulJsonItem {
  fields: any
}
export interface ContentfulJsonAsset extends ContentfulJsonItem {
}
export interface ContentfulQueryResponse {
  items: ContentfulJsonItem[],
  includes?: {
    Asset?: ContentfulJsonAsset[],
    Entry?: ContentfulJsonEntry[],
  },
  total: number,
}
type LinkMap = {
  [id: string]: ContentfulJsonItem,
}

class QueryApi {
  private overrides: {
    [id: string]: any,
  }
  private client: AxiosInstance

  constructor(space: string, accessToken: string, host: string, client: AxiosInstance) {
    this.overrides = {}
    this.client = client
  }

  static create(space: string, accessToken: string, host = 'cdn.contentful.com'): QueryApi {
    const client = axios.create({
      baseURL: `https://${host}/spaces/${space}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    return new QueryApi(space, accessToken, host, client)
  }

  async getEntries(params?: Object) {
    const result: ContentfulQueryResponse = await this.client
      .get('/entries', { params })
      .then(result => result.data)
    result.items = result.items.map(this.checkOverride)
    this.linkIncluded(result)
    return result
  }

  async getEntry(id: string) {
    const entry = await this.client.get(`/entries/${id}`).then(result => result.data)
    return this.checkOverride(entry)
  }

  override(entry: any) {
    this.overrides[entry.sys.id] = entry
  }

  private populateLinks(links: ContentfulJsonItem[], linkMap: LinkMap) {
    for (const asset of links) {
      if (!asset.sys) {
        return
      }

      const entry = this.checkOverride(asset)
      linkMap[entry.sys.id] = entry
    }
  }

  private linkIncluded(result: ContentfulQueryResponse) {
    const linkMap: LinkMap = {}

    // Find included models
    if (result.includes) {
      this.populateLinks(result.includes.Asset || [], linkMap)
      this.populateLinks(result.includes.Entry || [], linkMap)
    }

    // Add included models to items
    for (let i = 0; i < result.items.length; i++) {
      this.linkFields(result.items, i, linkMap)
    }
  }

  private linkFields(parent: any, key: any, linkMap: LinkMap) {
    const item = parent[key]
    if (!item) {
      return
    }

    const isArray = item instanceof Array
    const isLeaf = !isArray && !item.fields

    if (isLeaf) {
      if (item.sys && item.sys.type === 'Link') {
        const entry = linkMap[item.sys.id] || (this.overrides[item.sys.id] && this.overrides[item.sys.id].fields)
        parent[key] = entry

        // Link nested models
        const fieldNames = Object.keys(entry.fields)
        fieldNames.forEach(fieldName => this.linkFields(entry.fields, fieldName, linkMap))
      }
    } else if (isArray) {
      item.forEach((subItem: ContentfulJsonItem, index: Number) => this.linkFields(item, index, linkMap))
    } else {
      const fieldNames = Object.keys(item.fields)
      fieldNames.forEach(fieldName => this.linkFields(item.fields, fieldName, linkMap))
    }
  }

  private checkOverride = (entry: ContentfulJsonItem) => {
    const other = this.overrides[entry.sys.id]
    if (other && other.sys.updatedAt > entry.sys.updatedAt) {
      return other
    } else {
      return entry
    }
  }
}

export default QueryApi
