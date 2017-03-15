import { get } from './accessors'

describe('the get accessor', () => {
  it('can fetch one level deep', () => {
    const expected = 'nice'
    const source = {
      first: expected,
    }

    const result = get(source, 'first')
    expect(result).toEqual(expected)
  })
})
