import { injectLocale, extractLocale } from './locale'

describe('inject locale', () => {
  it('should handle injecting string values', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: 'derp',
        date: '1337'
      }
    }

    const expected = {
      fields: {
        name: {
          [locale]: 'derp'
        },
        date: {
          [locale]: '1337'
        }
      }
    }

    const injected = injectLocale(source, locale)
    expect(injected).toEqual(expected)
  })

  it('should handle injecting undefined values', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: undefined,
        date: undefined
      }
    }

    const expected = {
      fields: {
        name: {
          [locale]: undefined
        },
        date: {
          [locale]: undefined
        }
      }
    }

    const injected = injectLocale(source, locale)
    expect(injected).toEqual(expected)
  })

  it('should handle injecting multiple locales', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: 'hello'
      },
      sys: {
        locale,
      },
      '__fullModel': {
        fields: {
          name: {
            [locale]: 'hello',
            'en-GB': 'tis a nice day',
          }
        }
      }
    }

    const expected = {
      fields: {
        name: {
          'en-US': 'hello',
          'en-GB': 'tis a nice day'
        }
      }
    }

    const injected = injectLocale(source, locale)
    expect(injected).toEqual(expected)
  })
})

describe('extract locale', () => {
  it('should handle extracting string values', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: {
          [locale]: 'derp'
        }
      }
    }

    const expected = {
      fields: {
        name: 'derp',
      }
    }

    const extracted = extractLocale(source, locale)
    expect(extracted.fields).toEqual(expected.fields)
  })

  it('should handle extracting undefined values', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: {
          [locale]: undefined
        }
      }
    }

    const expected = {
      fields: {
        name: undefined,
      }
    }

    const extracted = extractLocale(source, locale)
    expect(extracted.fields).toEqual(expected.fields)
  })

  it('should handle extracing different values', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: {
          [locale]: undefined,
        },
        date: {
          [locale]: {
            year: 1337,
            month: 3,
            day: 14,
          }
        }
      }
    }

    const expected = {
      fields: {
        name: undefined,
        date: {
          year: 1337,
          month: 3,
          day: 14,
        },
      }
    }

    const extracted = extractLocale(source, locale)
    expect(extracted.fields).toEqual(expected.fields)
  })

  it('should handle multiple locales', () => {
    const locale = 'en-US'
    const source = {
      fields: {
        name: {
          'en-US': 'hello',
          'en-GB': 'tis a nice day'
        }
      }
    }

    const expected = {
      fields: {
        name: 'hello'
      },
      sys: {
        locale,
      },
      '__fullModel': {
        fields: {
          name: {
            [locale]: 'hello',
            'en-GB': 'tis a nice day',
          }
        }
      }
    }

    const extracted = extractLocale(source, locale)
    expect(extracted).toEqual(expected)
  })
})
