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
    const fieldValueIsDefined = fieldValue !== undefined
    const fieldValueIsObject = fieldValue instanceof Object

    let injectedValue
    if (fieldValueIsObject) {
      injectedValue = cloneDeep(fieldValue)
    } else {
      injectedValue = fieldValue
    }

    modelCopy.fields[fieldName] = {
      [locale]: injectedValue
    }
  }
  return modelCopy
}
