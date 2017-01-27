import * as React from 'react'
import * as classNames from 'classnames'

class EditableList extends React.Component<any, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  async onEdit(item : any) {
    const { onChange } = this.props
    const { tux } = this.context
    const didChange = await tux.editModel(item)
    if (didChange && onChange) {
      onChange()
    }
  }

  render() {
    const { list, children } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing
    return (
      <div className={classNames('EditableList', isEditing && 'is-editing')}>
        {list.map((item : any) => {
          const child = children(item)
          return (
            <div key={child.key} className="EditableList-item">
              {child}
              {isEditing && (
                <div className="EditableList-controls">
                  <div className="EditableList-btn" onClick={() => this.onEdit(item)}>Edit</div>
                </div>
              )}
            </div>
          )
        })}
        <style jsx>{`
          .EditableList {}

          .is-editing > .EditableList-item {
            position: relative;
          }

          .is-editing > .EditableList-item:hover {
            box-shadow: 0 0 5px rgb(250, 187, 60);
          }

          .EditableList-controls {
            background: rgb(250, 187, 60);
            bottom: 100%;
            color: #fff;
            opacity: 0;
            position: absolute;
            right: 0;
            transition: opacity 0.3s, visibility 0.3s 0.3s;
            visibility: hidden;
          }

          .EditableList-item:hover .EditableList-controls {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
          }

          .EditableList-btn {
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
}

export default EditableList
