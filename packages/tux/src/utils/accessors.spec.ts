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

  it('can fetch two levels deep', () => {
    const key = 'first.second'
    const expected = 'nice'
    const source = {
      first: {
        second: expected,
      },
      [key]: 'not nice',
    }

    const result = get(source, key)
    expect(result).toEqual(expected)
  })

  it('can fetch four levels deep', () => {
    const key = 'first.second.third.fourth'
    const expected = 'nice'
    const source = {
      first: {
        second: {
          third: {
            fourth: expected
          }
        }
      }
    }

    const result = get(source, key)
    expect(result).toEqual(expected)
  })

  it('returns null if key does not exist', () => {
    const key = 'first.second.third'
    const expected = null
    const source = {}

    const result = get(source, key)
    expect(result).toEqual(expected)
  })

  it('can handle when key is array', () => {
    const expected = 'nice'
    const key = ['first', 'second']
    const source = {
      first: {
        second: expected,
      },
    }

    const result = get(source, key)
    expect(result).toEqual(expected)
  })
})
