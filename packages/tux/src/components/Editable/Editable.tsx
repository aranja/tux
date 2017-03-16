import React from 'react'
import EditableInline from './EditableInline'
import EditableModal from './EditableModal'

export interface EditableProps {
  model: any,
  field: string | Array<string>,
  onChange: Function,
  children: any,
  className: string,
  shouldDisplayClues: boolean,
}

class Editable extends React.Component<EditableProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state = {
    shouldDisplayClues: false,
  }

  async componentDidMount() {
    const user = await this.context.tux.adapter.currentUser()

    if (user) {
      this.setState({
        shouldDisplayClues: true,
      })
    }
  }

  render() {
    const { children, field, model, onChange, className } = this.props
    const { shouldDisplayClues } = this.state
    const isEditing = this.context.tux && this.context.tux.isEditing
    if (field) {
      return <EditableInline model={model} field={field} shouldDisplayClues={shouldDisplayClues}/>
    }

    return (
      <EditableModal
      className={className}
      model={model}
      onChange={onChange}
      shouldDisplayClues={shouldDisplayClues}
      >
        {children}
      </EditableModal>
    )
  }
}

export default Editable
