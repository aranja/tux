import QueryApi from './query-api'
import { AxiosInstance } from 'axios'

describe('query entries', () => {
  it('should normalize nested models with assets', async () => {
    const ClientMock = jest.fn<AxiosInstance>(() => ({
      get: async () => ({
        data: {
          items: [
            {
              sys: {
                id: 'id-of-item',
              },
              fields: {
                list: [
                  {
                    sys: {
                      type: 'Link',
                      linkType: 'Entry',
                      id: 'id-of-include',
                    },
                  },
                ],
              },
            },
          ],
          includes: {
            Entry: [
              {
                sys: {
                  id: 'id-of-include',
                  type: 'Entry',
                  contentType: {
                    sys: {
                      type: 'Link',
                      id: 'item',
                    },
                  },
                },
                fields: {
                  heading: 'This is a list item with an image',
                  image: {
                    sys: {
                      type: 'Link',
                      linkType: 'Asset',
                      id: 'id-of-image',
                    },
                  },
                },
              },
            ],
            Asset: [
              {
                sys: {
                  id: 'id-of-image',
                  type: 'Asset',
                },
                fields: {
                  title: 'Image title',
                  file: {
                    url: '//path-to-image.jpg',
                  },
                },
              },
            ],
          },
        },
      }),
    }))

    const client = new ClientMock()
    const api = new QueryApi(null, null, null, client)

    const { items: [entry] } = await api.getEntries()
    expect(entry.fields.list.length).toEqual(1)

    const [{ entry: listItem }] = entry.fields.list
    expect(listItem.heading).toEqual('This is a list item with an image')
    expect(listItem._contentType).toEqual('item')
    expect(listItem.image.asset.title).toEqual('Image title')
    expect(listItem.image.asset.file.url).toEqual('//path-to-image.jpg')
  })
})
