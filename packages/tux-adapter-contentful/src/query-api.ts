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
    const result = await this.client.get('/entries', { params }).then(result => result.data)
    result.items = result.items.map(this.checkOverride)
    return result
  }

  async getEntry(id : string) {
    const entry = await this.client.get(`/entries/${id}`).then(result => result.data)
    return this.checkOverride(entry)
  }

  override(entry : any) {
    this.overrides[entry.sys.id] = entry
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
