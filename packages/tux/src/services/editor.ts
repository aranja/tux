const schema = new Map()

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

export function registerEditable(type: string, value: Array<Field> | ((editorSchema: Array<Field>) => Array<Field>)) {
  schema.set(type, value)
}

export function getEditorSchema(meta: Meta): Array<Field> {
  const adapterSchema = meta.editorSchema
  const userDefinedSchema = schema.get(meta.type)

  let result = []
  if (adapterSchema && !userDefinedSchema) {
    result = adapterSchema
  } else if (!adapterSchema && userDefinedSchema) {
    if (userDefinedSchema instanceof Array) {
      result = userDefinedSchema
    }
    // else, if the userDefinedSchema is a function to operate on current schema
    // we do not have any schema to operate on, so return an empty array
  } else if (adapterSchema && userDefinedSchema) {
    if (userDefinedSchema instanceof Array) {
      // overwrite adapter schema
      result = userDefinedSchema
    } else if (userDefinedSchema instanceof Function) {
      // operate on adapter schema with user provided function
      result = userDefinedSchema(adapterSchema)
    }
  }
  return result
}
