let currentLocale = ''

export function setLocale(locale: string) {
  if (locale !== currentLocale) {
    currentLocale = locale
  }
}

export function extractLocale(model: any) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName][currentLocale]
    model.fields[fieldName] = fieldValue
  }
  return model
}

export function injectLocale(model: any) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = Object.assign(model.fields[fieldName])
    model.fields[fieldName] = {
      [currentLocale]: fieldValue
    }
  }
  return model
}
