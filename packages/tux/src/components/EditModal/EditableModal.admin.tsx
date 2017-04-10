import React from 'react'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../Editable'

export type EditModalProps = EditableProps & {
  onChange: Function,
}

class EditModal extends React.Component<EditModalProps, any> {
  onEdit = async (): Promise<void> => {
    const { onChange, onModalEdit, isEditing, model } = this.props
    if (!isEditing || !onModalEdit) { return }
    const didChange = await onModalEdit(model)
    if (didChange && onChange) {
      onChange()
    }
  }

  render() {
    const { children, isEditing } = this.props
    return (
      <div className={`EditModal${isEditing ? ' is-editing' : ''}`} onClick={this.onEdit}>
        {children}
        <style jsx>{`
          .EditModal.is-editing:hover {
            cursor: pointer;
            position: relative;
            outline: 1px dashed rgba(128, 128, 128, 0.7);
            outline-offset: 10px;
          }
        `}
        </style>
      </div>
    )
  }
}

export default createEditable()(EditModal)

