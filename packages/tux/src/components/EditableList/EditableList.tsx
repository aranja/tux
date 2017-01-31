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
      </div>
    )
  }
}

export default EditableList
