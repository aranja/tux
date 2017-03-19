import React, { ComponentClass, StatelessComponent } from 'react'
import { EditableProps } from './index'

export interface State {
  readOnly: boolean,
}

export function createEditable<OriginalProps>() {
  return function editable(
    Editor:
      ComponentClass<OriginalProps & EditableProps> |
      StatelessComponent<OriginalProps & EditableProps>
  ): ComponentClass<EditableProps> {
    class Editable extends React.Component<OriginalProps & EditableProps, State> {
      static contextTypes = {
        tux: React.PropTypes.object,
        model: React.PropTypes.object,
        readOnly: React.PropTypes.bool,
      }

      static childContextTypes = {
        model: React.PropTypes.object,
        readOnly: React.PropTypes.bool,
      }

      private isMounded: boolean

      state = {
        readOnly: typeof this.context.readOnly === 'undefined' ? true : this.context.readOnly,
      }

      componentDidMount() {
        this.isMounded = true
        this.init()
      }

      componentWillUnmount() {
        this.isMounded = false
      }

      getChildContext() {
        return {
          model: this.props.model,
          readOnly: this.state.readOnly,
        }
      }

      async init(): Promise<void> {
        let readOnly = false
        try {
          readOnly = (await this.context.tux.adapter.currentUser()) == null
        } finally {
          if (this.isMounded) {
            this.setState({ readOnly })
          }
        }
      }

      onModalEdit = async (model: any) => {
        return this.context.tux.editModel(model)
      }

      onLoad = async (model: any) => {
        return model
      }

      onSave = async (model: any) => {

      }

      render() {
        const { model } = this.props
        const { tux: { isEditing } } = this.context
        return (
          <Editor
            {...this.props}
            model={model || this.context.model || {}}
            isEditing={isEditing}
            readOnly={this.state.readOnly}
            onModalEdit={this.onModalEdit}
            onLoad={this.onLoad}
            onSave={this.onSave}
          />
        )
      }
    }

    return Editable
  }
}

const Internal = ({ children }: EditableProps) => (
  <span>{children}</span>
)

export default createEditable()(
  Internal
)
