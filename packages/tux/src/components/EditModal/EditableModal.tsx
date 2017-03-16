import React from 'react'

export interface EditModalProps {
  children?: any,
}

class EditModal extends React.Component<EditModalProps, any> {
  static contextTypes = {
    model: React.PropTypes.object,
  }

  onEdit = async (): Promise<void> => {
    // const { onChange } = this.props
    // const { tux } = this.context
    // const isEditing = tux && tux.isEditing
    // const didChange = await tux.editModel(model)
    // if (isEditing && didChange && onChange) {
    //   onChange()
    // }
  }

  render() {
    const { children, ...props } = this.props
    return (
      <div {...props} onClick={this.onEdit}>
        {children}
      </div>
    )
  }
}

export default EditableModal
