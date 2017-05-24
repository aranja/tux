import React, { ComponentClass, StatelessComponent } from 'react'
import PropTypes from 'prop-types'
import { EditableProps } from '../../interfaces'

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
        tux: PropTypes.object,
        tuxModel: PropTypes.object,
      }

      static childContextTypes = {
        tuxModel: PropTypes.object,
      }

      getChildContext() {
        return {
          tuxModel: this.props.model || this.context.tuxModel,
        }
      }

      render() {
        const { model } = this.props
        const { tux, tuxModel } = this.context
        return (
          <Editor
            {...this.props}
            model={model || tuxModel || {}}
            isEditing={tux.isEditing}
            tux={tux}
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
