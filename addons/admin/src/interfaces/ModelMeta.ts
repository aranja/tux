import Field from './Field'

interface ModelMeta {
  type: string
  editorSchema?: Array<Field>
  name?: string
}

export default ModelMeta
