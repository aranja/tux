import cloneDeep from 'lodash/cloneDeep'

export function extractLocale(model: any, locale: string) {
  const clone = cloneDeep(model)

  for (const fieldName of Object.keys(model.fields)) {
    _extractAllLocales(clone, fieldName, locale)

    const fieldValue = model.fields[fieldName][locale]
    clone.fields[fieldName] = fieldValue
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

    _injectAllLocales(clone, fieldName, locale)
  }

  _cleanModel(clone)

  return clone
}

function _extractAllLocales(model: any, fieldName: string, locale: string) {
  const existingLocales = Object.keys(model.fields[fieldName])
  for (const currentLocale of existingLocales) {
    const fieldValue = model.fields[fieldName][currentLocale]

    if (!model['__fullModel']) {
      model['__fullModel'] = {
        fields: {}
      }
    }

    if (!model['__fullModel'].fields[fieldName]) {
      model['__fullModel'].fields[fieldName] = {}
    }

    model['__fullModel'].fields[fieldName][currentLocale] = fieldValue
  }
}

function _injectAllLocales(model: any, fieldName: string, locale: string) {
  if (!model['__fullModel']) {
    return
  }

  const existingLocales = Object.keys(model['__fullModel'].fields[fieldName])
  for (const currentLocale of existingLocales) {
    if (currentLocale === locale) {
      continue
    }

    const fieldValue = model['__fullModel'].fields[fieldName][currentLocale]
    model.fields[fieldName][currentLocale] = fieldValue
  }
}

function _cleanModel(model: any) {
  if (model.sys) {
    delete model.sys
  }

  if (model['__fullModel']) {
    delete model['__fullModel']
  }
}
