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

    model.fields[fieldName] = {
      [locale]: fieldValue
    }
  }

  return model
}
