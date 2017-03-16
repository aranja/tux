import React from 'react'
import classNames from 'classnames'

export interface EditableModalProps {
  model: any,
  children?: any,
  onChange: Function,
  className: string,
  isLoggedIn: boolean,
}

class EditableModal extends React.Component<EditableModalProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  async onEdit(): Promise<void> {
    const { onChange, model, isLoggedIn } = this.props
    const { tux } = this.context
    const isEditing = tux && tux.isEditing
    const didChange = await tux.editModel(model)
    if (isEditing && didChange && onChange) {
      onChange()
    }
  }

  render() {
    const { model, children, className, isLoggedIn } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing

    const classes = classNames(
      className,
      'EditableModal',
      isEditing && 'is-editing',
    )

    return (
      <div className={classes} onClick={() => {isEditing && this.onEdit()}}>
        {children}
      </div>
    )
  }
}

export default EditableModal
