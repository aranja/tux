import axios from 'axios'
import { AxiosInstance } from 'axios';

// TODO: Fill in
export interface ContentfulJsonItem {
  sys: {
    id: string,
    updatedAt: string,
  }
}
export interface ContentfulJsonEntry extends ContentfulJsonItem {
  fields: any
}
export interface ContentfulJsonAsset extends ContentfulJsonItem {
}
export interface ContentfulQueryResponse {
  items: ContentfulJsonItem[],
  includes: {
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

  constructor(space: string, accessToken: string, subDomain: string) {
    this.overrides = {}
    this.client = axios.create({
      baseURL: `https://${subDomain}.contentful.com/spaces/${space}`,
      headers: {
        'authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getEntries(params?: Object) {
    const result: ContentfulQueryResponse = await this.client.get('/entries', { params }).then(result => result.data)
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
      if (asset.sys) {
        linkMap[asset.sys.id] = this.checkOverride(asset).fields
      }
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
    for (const item of result.items) {
      this.linkFields(item, linkMap)
    }
  }

  private linkFields(item: any, linkMap: LinkMap) {
    if (!item) {
      return
    }

    const isArray = item instanceof Array
    const isLeaf = !isArray && !item.fields

    if (isLeaf) {
      if (item.sys && item.sys.type === 'Link') {
        const linkType = item.sys.linkType.toLowerCase()
        item[linkType] = linkMap[item.sys.id]
      }
      return
    } else if (isArray) {
      item.forEach((subItem: ContentfulJsonItem) => this.linkFields(subItem, linkMap))
    } else {
      const fieldNames = Object.keys(item.fields)
      fieldNames.forEach(fieldName => this.linkFields(item.fields[fieldName], linkMap))
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
