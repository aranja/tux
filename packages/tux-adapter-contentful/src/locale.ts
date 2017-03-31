import cloneDeep from 'lodash/cloneDeep'

export function extractLocale(model: any, locale: string) {
  const clone = cloneDeep(model)
  const result = {
    fields: {},
    sys: { locale, ...clone.sys },
    __fullModel: null,
  }

  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName][locale]
    result.fields[fieldName] = fieldValue
  }

  result.__fullModel = clone

  return result
}

export function injectLocale(model: any, locale: string) {
  if (!model.__fullModel) {
    throw new Error('injectLocale: __fullModel property is required on model')
  }
  const result = model.__fullModel

  const fieldNames = Object.keys(model.fields)
  for (const fieldName of fieldNames) {
    const fieldValue = model.fields[fieldName]
    if (!result.fields[fieldName]) {
      result.fields[fieldName] = {}
    }
    result.fields[fieldName][locale] = fieldValue
  }

  return result
}
