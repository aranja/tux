import cloneDeep from 'lodash/cloneDeep'

export function extractLocale(model: any, locale: string) {
  const clone = cloneDeep(model)

  for (const fieldName of Object.keys(model.fields)) {
    const existingLocales = Object.keys(model.fields[fieldName])
    for (const currentLocale of existingLocales) {
      const fieldValue = model.fields[fieldName][currentLocale]

      if (currentLocale === locale) {
        clone.fields[fieldName] = fieldValue
      }
  
      if (!clone['__fullModel']) {
        clone['__fullModel'] = {
          fields: {}
        }
      }

      if (!clone['__fullModel'].fields[fieldName]) {
        clone['__fullModel'].fields[fieldName] = {}
      }

      clone['__fullModel'].fields[fieldName][currentLocale] = fieldValue
    }
  }

  clone.sys = {
    locale,
  }

  return clone
}

export function injectLocale(model: any, locale: string) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName]

    model.fields[fieldName] = {
      [locale]: fieldValue
    }
  }

  return model
}
