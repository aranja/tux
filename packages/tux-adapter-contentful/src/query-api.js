import axios from 'axios'

class QueryApi {
  constructor(space, accessToken, subDomain) {
    this.overrides = {}
    this.client = axios.create({
      baseURL: `https://${subDomain}.contentful.com/spaces/${space}`,
      headers: {
        'authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getEntries(params) {
    const result = await this.client.get('/entries', { params }).then(result => result.data)
    result.items = result.items.map(this.checkOverride)
    return result
  }

  async getEntry(id) {
    const entry = await this.client.get(`/entries/${id}`).then(result => result.data)
    return this.checkOverride(entry)
  }

  override(entry) {
    this.overrides[entry.sys.id] = entry
  }

  checkOverride = (entry) => {
    const other = this.overrides[entry.sys.id]
    if (other && other.sys.updatedAt > entry.sys.updatedAt) {
      return other
    } else {
      return entry
    }
  }
}

export default QueryApi
