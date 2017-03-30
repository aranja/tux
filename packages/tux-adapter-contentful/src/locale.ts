import cloneDeep from 'lodash/cloneDeep'

export function extractLocale(model: any, locale: string) {
  const modelCopy = cloneDeep(model)
  for (const fieldName of Object.keys(modelCopy.fields)) {
    const fieldValue = modelCopy.fields[fieldName][locale]
    modelCopy.fields[fieldName] = fieldValue
  }
  return modelCopy
}

export function injectLocale(model: any, locale: string) {
  const modelCopy = cloneDeep(model)
  for (const fieldName of Object.keys(modelCopy.fields)) {
    const fieldValue = modelCopy.fields[fieldName]

    modelCopy.fields[fieldName] = {
      [locale]: fieldValue
    }
  }

  return modelCopy
}
