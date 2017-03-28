export function extractLocale(model: any, locale: string) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName][locale]
    model.fields[fieldName] = fieldValue
  }
  return model
}

export function injectLocale(model: any, locale: string) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName]
    const fieldValueIsDefined = fieldValue !== undefined
    const fieldValueIsObject = fieldValue instanceof Object

    let injectedValue
    if (fieldValueIsObject) {
      injectedValue = Object.assign(fieldValue)
    } else {
      injectedValue = fieldValue
    }

    model.fields[fieldName] = {
      [locale]: injectedValue
    }
  }
  return model
}
