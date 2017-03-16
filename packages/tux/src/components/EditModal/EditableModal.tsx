import React from 'react'

export interface EditableModalProps {
  children?: any,
}

class EditableModal extends React.Component<EditableModalProps, any> {
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
    const isEditing = this.context.tux && this.context.tux.isEditing
    return (
      <div {...props} onClick={this.onEdit}>
        {children}
        <style jsx>{`
          .EditableModal.is-editing {
            cursor: pointer;
          }
          .EditableModal.is-editing, .EditableModal.is-editing > * {
            outline: 1px solid aquamarine !important;
          }
        `}</style>
      </div>
    )
  }
}

export default EditableModal
