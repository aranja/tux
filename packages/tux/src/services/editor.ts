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

  const hasOnlyAdapterSchema = adapterSchema && !userDefinedSchema
  const hasOnlyUserDefinedSchema = !adapterSchema && userDefinedSchema
  const hasBothSchemas = adapterSchema && userDefinedSchema

  if (hasOnlyAdapterSchema) {
    return adapterSchema
  } else if (hasOnlyUserDefinedSchema) {
    if (userDefinedSchema instanceof Array) {
      return userDefinedSchema
    }
    // else, if the userDefinedSchema is a function to operate on current schema
    // we do not have any schema to operate on, so return an empty array
  } else if (hasBothSchemas) {
    if (userDefinedSchema instanceof Array) {
      // overwrite adapter schema
      return userDefinedSchema
    } else if (userDefinedSchema instanceof Function) {
      // operate on adapter schema with user provided function
      return _mergeSchemas(adapterSchema, userDefinedSchema)
    }
  }
  return []
}

function _mergeSchemas(adapterSchema: Array<Field>, userFunction: Function) {
  const schemaAsMap = new Map(adapterSchema.map(field => [field.field, field]))
  userFunction(schemaAsMap)

  const result = []
  for (const [fieldName, field] of schemaAsMap) {
    result.push(field)
  }
  return result
}
