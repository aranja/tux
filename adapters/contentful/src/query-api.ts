import axios, { AxiosInstance } from 'axios'

// TODO: Fill in
export interface ContentfulJsonItem {
  sys: {
    id: string
    updatedAt: string
    contentType: {
      sys: {
        id: string
      }
    }
  }
  fields: any
}
export interface ContentfulJsonEntry extends ContentfulJsonItem {
  fields: any
}
export interface ContentfulJsonAsset extends ContentfulJsonItem {}
export interface ContentfulQueryResponse {
  items: ContentfulJsonItem[]
  includes?: {
    Asset?: ContentfulJsonAsset[]
    Entry?: ContentfulJsonEntry[]
  }
  total: number
}
type LinkMap = {
  [id: string]: ContentfulJsonItem
}

class QueryApi {
  private overrides: {
    [id: string]: any
  }
  private client: AxiosInstance

  constructor(
    space: string,
    accessToken: string,
    host: string,
    client: AxiosInstance
  ) {
    this.overrides = {}
    this.client = client
  }

  static create(
    space: string,
    accessToken: string,
    host = 'cdn.contentful.com'
  ): QueryApi {
    const client = axios.create({
      baseURL: `https://${host}/spaces/${space}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    return new QueryApi(space, accessToken, host, client)
  }

  async getEntries(params?: object) {
    const result: ContentfulQueryResponse = await this.client
      .get('/entries', { params })
      .then((res: { data: any }) => res.data)
    result.items = result.items.map(this.checkOverride)
    this.linkIncluded(result)
    return result
  }

  async getEntry(id: string) {
    const entry = await this.client
      .get(`/entries/${id}`)
      .then((res: { data: any }) => res.data)
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
      const item = result.items[i]
      result.items[i] = this.linkEntry(item, linkMap)
    }
  }

  private linkEntry(item: any, linkMap: LinkMap): any {
    if (!item) {
      return item
    }

    const hasSys = !!item.sys
    const isLink = hasSys && item.sys.type === 'Link'
    const isArray = item instanceof Array

    if (item.fields) {
      Object.keys(item.fields).forEach(fieldName => {
        item.fields[fieldName] = this.linkEntry(item.fields[fieldName], linkMap)
      })
    }

    if (isLink) {
      const itemId = item.sys.id
      const entry = linkMap[itemId] || this.overrides[itemId]

      return this.linkEntry(entry, linkMap)
    } else if (isArray) {
      return item.map((subItem: any) => this.linkEntry(subItem, linkMap))
    }
    return item
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
