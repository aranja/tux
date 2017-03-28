import React from 'react'
import EditableInline from './EditableInline'
import EditableModal from './EditableModal'

export interface EditableProps {
  model: any,
  field: string | Array<string>,
  onChange: Function,
  children: any,
  className: string,
  isLoggedIn: boolean,
}

class Editable extends React.Component<EditableProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state = {
    isLoggedIn: false,
  }

  async componentDidMount() {
    const user = await this.context.tux.adapter.currentUser()

    if (user) {
      this.setState({
        isLoggedIn: true,
      })
    }
  }

  render() {
    const { children, field, model, onChange, className } = this.props
    const { isLoggedIn } = this.state
    const isEditing = isLoggedIn && this.context.tux && this.context.tux.isEditing
    if (field) {
      return <EditableInline model={model} field={field} isLoggedIn={isLoggedIn}/>
    }

    return (
      <EditableModal
        className={className}
        model={model}
        onChange={onChange}
        isLoggedIn={isLoggedIn}
      >
        {children}
      </EditableModal>
    )
  }
}

export default Editable
