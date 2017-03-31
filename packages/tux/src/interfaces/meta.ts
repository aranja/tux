import Field from './field'

export interface Meta {
  type: string,
  editorSchema?: Array<Field>,
  name?: string,
}

export default Meta
