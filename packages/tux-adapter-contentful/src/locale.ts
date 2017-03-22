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
    let fieldValue
    if (model.fields[fieldName]) {
      if (model.fields instanceof Object) {
        fieldValue = Object.assign(model.fields[fieldName])
      } else {
        fieldValue = model.fields[fieldName]
      }
    }

    model.fields[fieldName] = {
      [locale]: fieldValue
    }
  }
  return model
}
