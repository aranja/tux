const CURRENT_LOCALE = 'en-US'

export function extractLocale(model: any) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName][CURRENT_LOCALE]
    model.fields[fieldName] = fieldValue
  }
  return model
}

export function injectLocale(model: any) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = Object.assign(model.fields[fieldName])
    console.log(fieldValue)
    model.fields[fieldName] = {
      [CURRENT_LOCALE]: fieldValue
    }
  }
  return model
}

function _copy(target: Object) {
  return JSON.parse(JSON.stringify(target))
}
