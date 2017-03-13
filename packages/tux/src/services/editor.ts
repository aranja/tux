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
  name?: string,
}

export function registerEditable(
  type: string,
  value: Array<Field> | ((editorSchema: Map<string, Field>) => Map<string, Field>)
) {
  schema.set(type, value)
}

export function getEditorSchema(meta: Meta): Array<Field> {
  const adapterSchema = meta.editorSchema
  const userDefinedSchema = schema.get(meta.type)

  if (adapterSchema && !userDefinedSchema) {
    return adapterSchema
  } else if (!adapterSchema && userDefinedSchema) {
    if (userDefinedSchema instanceof Array) {
      return userDefinedSchema
    }
    // else, if the userDefinedSchema is a function to operate on current schema
    // we do not have any schema to operate on, so return an empty array
  } else if (adapterSchema && userDefinedSchema) {
    if (userDefinedSchema instanceof Array) {
      // overwrite adapter schema
      return userDefinedSchema
    } else if (userDefinedSchema instanceof Function) {
      // operate on adapter schema with user provided function
      const schemaAsMap = new Map(adapterSchema.map(field => [field.field, field]))
      const editedSchema = userDefinedSchema(schemaAsMap)
      const result = []
      for (const field of editedSchema) {
        result.push(field)
      }
      return result
    }
  }
  return []
}
