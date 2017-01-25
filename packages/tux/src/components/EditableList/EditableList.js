import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class EditableList extends Component {
  static contextTypes = {
    tux: PropTypes.object,
  }

  async onEdit(item) {
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
        {list.map(item => {
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
