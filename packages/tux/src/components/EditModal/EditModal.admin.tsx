import React, { MouseEvent } from 'react'
import classNames from 'classnames'
import { createEditable } from '../Editable'
import { EditableProps } from '../../interfaces'

interface EditModalProps extends EditableProps {
  className?: any,
  onClick?: (event: MouseEvent<any>) => void
}

class EditModal extends React.Component<EditModalProps, any> {
  onEdit = async (event: MouseEvent<any>) => {
    const { tux, model } = this.props

    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (!event.defaultPrevented) {
      await tux.editModel(model)
    }
  }

  render() {
    const { children, isEditing, tux, model, className, ...rest } = this.props
    const classes = classNames(
      className,
      'EditModal',
      isEditing && 'is-editing'
    )

    return (
      <div
        className={classes}
        onClick={isEditing ? this.onEdit : undefined}
        {...rest}
      >
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

