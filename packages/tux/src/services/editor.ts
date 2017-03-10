const schema = new Map()
const userSchema = new Map()

export interface Field {
  field: string,
  label: string,
  component: React.ReactElement<any>,
  props?: Object
}

export interface Meta {
  type: string,
  editorSchema?: Array<Field>,
}

export function registerEditable(type: string, value: any) {
  const typeOfValue = typeof value

  if (typeOfValue === 'object') {
    _registerFields(type, value)
  } else if (typeOfValue === 'function') {
    _registerProcedure(type, value)
  }
}

export function getEditorSchema(meta: Meta): Array<Field> {
  const typeSchema = schema.get(meta.type)
  const userSchemaForType = userSchema.get(meta.type)

  console.log(`getEditorSchema: ${schema.has(meta.type)} ${userSchema.has(meta.type)}`)

  let result = []
  if (typeSchema && !userSchemaForType) {
    result = _listFromObject(typeSchema)
  } else if (!typeSchema && userSchemaForType) {
    result = _listFromObject(userSchemaForType)
  } else if (typeSchema && userSchemaForType) {
    const finalSchemaForType = Object.assign(userSchemaForType || {}, typeSchema || {})
    result = _listFromObject(finalSchemaForType)
  }
  console.log(result)
  return result
}

function _listFromObject(obj: any) {
  const result = []
  for (const objKey of Object.keys(obj)) {
    result.push(obj[objKey])
  }
  return result
}

function _registerFields(type: string, value: Array<Field>) {
  console.log(`registering fields for ${type}`)
  userSchema.set(type, value)
}

function _registerProcedure(type: string, procedure: (editorSchema: Array<Field>) => Array<Field>) {
  console.log(`registering callback for ${type}`)
  userSchema.set(type, procedure(userSchema.get(type)))
}
