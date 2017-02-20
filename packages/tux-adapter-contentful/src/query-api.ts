import axios from 'axios'
import { AxiosInstance } from 'axios';

class QueryApi {
  private overrides : {
    [id : string] : any,
  }
  private client : AxiosInstance

  constructor(space : string, accessToken : string, subDomain : string) {
    this.overrides = {}
    this.client = axios.create({
      baseURL: `https://${subDomain}.contentful.com/spaces/${space}`,
      headers: {
        'authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getEntries(params? : Object) {
    const result = await this.client.get('/entries?include=1', { params }).then(result => result.data)
    result.items = result.items.map(this.checkOverride)
    this.linkIncluded(result)
    return result
  }

  async getEntry(id : string) {
    const entry = await this.client.get(`/entries/${id}`).then(result => result.data)
    return this.checkOverride(entry)
  }

  override(entry : any) {
    this.overrides[entry.sys.id] = entry
  }

  populateLinks(links, linkMap) {
    for (const asset of links) {
      if (asset.sys) {
        linkMap[asset.sys.id] = asset.fields
      }
    }
  }

  linkIncluded(result) {
    const linkMap = {}

    this.populateLinks(result.includes.Asset, linkMap)
    this.populateLinks(result.includes.Entry, linkMap)

    for (const item of result.items) {
      const fieldNames = Object.keys(item.fields)
      for (const fieldName of fieldNames) {
        const field = item.fields[fieldName]
        if (field instanceof Array) {
          for (const childField of field) {
            if (childField.sys && childField.sys.type === 'Link') {
              childField.text = linkMap[childField.sys.id].text
            }
          }
        } else if (field.sys && field.sys.type === 'Link') {
          field.url = linkMap[field.sys.id].file.url
        }
      }
    }
  }

  checkOverride = (entry : any) => {
    const other = this.overrides[entry.sys.id]
    if (other && other.sys.updatedAt > entry.sys.updatedAt) {
      return other
    } else {
      return entry
    }
  }
}

export default QueryApi
