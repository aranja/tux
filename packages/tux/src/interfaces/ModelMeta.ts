import Field from './field'

interface ModelMeta {
  type: string,
  editorSchema?: Array<Field>,
  name?: string,
}

export default ModelMeta
