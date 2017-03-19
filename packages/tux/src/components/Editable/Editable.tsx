import React from 'react'
import { ComponentClass, StatelessComponent } from 'react'
import { EditableProps } from './index'

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

      getChildContext() {
        return {
          model: this.props.model,
          readOnly: true,
        }
      }

      render() {
        const { model } = this.props
        return (
          <Editor
            {...this.props}
            model={model || this.context.model || {}}
            isEditing={false}
            readOnly={true}
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
