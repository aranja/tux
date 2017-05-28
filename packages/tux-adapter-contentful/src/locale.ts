import cloneDeep from 'lodash/cloneDeep'
import { ContentfulAdminModel, ContentfulEditModel } from './types'

export function extractLocale(model: ContentfulAdminModel, locale: string) {
  const clone = cloneDeep(model)
  const result: ContentfulEditModel = {
    fields: {},
    sys: { locale, ...clone.sys },
    __fullModel: clone,
  }

  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName][locale]
    result.fields[fieldName] = fieldValue
  }

  return result
}

export function injectLocale(model: ContentfulEditModel, locale: string) {
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
