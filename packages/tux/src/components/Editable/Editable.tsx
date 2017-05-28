import React, { ReactType, ComponentClass, StatelessComponent } from 'react'
import PropTypes from 'prop-types'
import { EditableProps } from '../../interfaces'

export interface State {
  readOnly: boolean,
}

export function createEditable<OriginalProps>() {
  type OuterProps = OriginalProps & EditableProps
  return function editable(
    Editor:
      ComponentClass<OuterProps> |
      StatelessComponent<OuterProps>
  ): ComponentClass<OuterProps> {
    class Editable extends React.Component<OuterProps, State> {
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
            {...(this.props as any)}
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
