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
    const { children } = this.props
    return (
      <div className="EditModal" onClick={this.onEdit}>
        {children}
        <style jsx>{`
          .EditModal:hover {
            cursor: pointer;
            outline: 1px dashed rgba(128, 128, 128, 0.7);
          }
        `}
        </style>
      </div>
    )
  }
}

export default EditModal
