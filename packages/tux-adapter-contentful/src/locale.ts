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
  const clone = cloneDeep(model)

  const fieldNames = Object.keys(model.fields)
  for (const fieldName of fieldNames) {
    const fieldValue = model.fields[fieldName]

    clone.fields[fieldName] = {
      [locale]: fieldValue
    }

    if (!clone['__fullModel']) {
      continue
    }

    const existingLocales = Object.keys(clone['__fullModel'].fields[fieldName])
    for (const currentLocale of existingLocales) {
      if (currentLocale === locale) {
        continue
      }

      const fieldValue = clone['__fullModel'].fields[fieldName][currentLocale]
      clone.fields[fieldName][currentLocale] = fieldValue
    }
  }

  _cleanModel(clone)

  return clone
}

function _extractAllLocales() {

}

function _injectAllLocales() {

}

function _cleanModel(model: any) {
  if (model.sys) {
    delete model.sys
  }

  if (model['__fullModel']) {
    delete model['__fullModel']
  }
}
