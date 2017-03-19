export { default } from './Editable'

export interface EditableProps {
  children?: any,
  model: any,
  readOnly?: boolean,
  isEditing?: boolean,
  onSave?: Function,
  onLoad?: Function,
  onModalEdit?: Function,
}
