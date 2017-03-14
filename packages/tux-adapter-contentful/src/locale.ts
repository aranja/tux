

export function extractLocale(model: any) {
  for (const fieldName of Object.keys(model.fields)) {
    const fieldValue = model.fields[fieldName]['en-US']
    model.fields[fieldName] = fieldValue
  }
  return model
}
