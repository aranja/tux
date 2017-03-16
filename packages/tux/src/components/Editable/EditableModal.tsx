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
      isLoggedIn && 'display-editable-clue'
    )

    return (
      <div className={classes} onClick={() => {isEditing && this.onEdit()}}>
        {children}
        <style jsx>{`
          .EditableModal.is-editing {
            cursor: pointer;
          }
          .EditableModal.is-editing, .EditableModal.is-editing > * {
            outline: 1px solid aquamarine !important;
          }
          .display-editable-clue {
            animation: editableClue 1s;
          }
          @keyframes editableClue {
            from {
              background: rgba(232, 0, 138, 0.2);
            }
            to {
              background: rgba(232, 0, 138, 0);
            }
          }
        `}</style>
      </div>
    )
  }
}

export default EditableModal
