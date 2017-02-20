import React = require('react')
import classNames = require('classnames')

class Editable extends React.Component<any, any> {
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
    const { list, children } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing
    return (
      <div className={classNames('Editable', isEditing && 'is-editing')}>
        {children}
        {isEditing && (
          <div className="Editable-controls">
            <div className="Editable-btn" onClick={() => this.onEdit()}>Edit</div>
          </div>
        )}
        <style jsx>{`
          .Editable.is-editing {
            position: relative;
          }

          .Editable.is-editing:hover {
            box-shadow: 0 0 5px rgb(250, 187, 60);
          }

          .Editable-controls {
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

          .Editable:hover .Editable-controls {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
          }

          .Editable-btn {
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
}

export default Editable
