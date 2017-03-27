export function extractLocale(model: any, locale: string) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName][locale]
    if (fieldValue) {
      model.fields[fieldName] = fieldValue
    } else {
      model.fields[fieldName] = undefined
    }
  }
  return model
}

export function injectLocale(model: any, locale: string) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName]
    const fieldValueIsDefined = fieldValue !== undefined
    const fieldValueIsObject = fieldValue instanceof Object

    let injectedValue = undefined
    if (fieldValueIsDefined) {
      if (fieldValueIsObject) {
        injectedValue = Object.assign(fieldValue)
      } else {
        injectedValue = fieldValue
      }
    }

    model.fields[fieldName] = {
      [locale]: injectedValue
    }
  }
  return model
}
