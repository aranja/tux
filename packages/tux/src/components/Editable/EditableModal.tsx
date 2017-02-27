import React from 'react'
import classNames from 'classnames'

export interface EditableModalProps {
  model : any,
  children : any,
  onChange : Function,
}

class EditableModal extends React.Component<EditableModalProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  async onEdit() {
    const { onChange, model } = this.props
    const { tux } = this.context
    const didChange = await tux.editModel(model)
    if (didChange && onChange) {
      onChange()
    }
  }

  render() {
    const { model, children } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing

    return (
      <div className={classNames('EditableModal', isEditing && 'is-editing')}>
        {children}
        {isEditing && (
          <div className="EditableModal-controls">
            <div className="EditableModal-btn" onClick={() => this.onEdit()}>Edit</div>
          </div>
        )}
        <style jsx>{`
          .EditableModal.is-editing {
            position: relative;
          }

          .EditableModal.is-editing:hover {
            box-shadow: 0 0 5px rgb(250, 187, 60);
          }

          .EditableModal-controls {
            background: rgb(250, 187, 60);
            border-radius: 3px 3px 0 0;
            bottom: 100%;
            color: #fff;
            opacity: 0;
            padding: 5px 10px;
            position: absolute;
            right: 0;
            transition: opacity 0.3s, visibility 0.3s 0.3s;
            visibility: hidden;
          }

          .EditableModal:hover .EditableModal-controls {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
          }

          .EditableModal-btn {
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
}

export default EditableModal
