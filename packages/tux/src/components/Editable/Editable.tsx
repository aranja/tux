import React, { ComponentClass, StatelessComponent } from 'react'
import any = jasmine.any

export interface Props {
  model: any,
}

export interface State {
  readOnly: boolean,
}

export type InnerProps<OriginalProps> = OriginalProps & Props

export function createEditable<OriginalProps>() {
  return function editable(
    Editor: ComponentClass<OriginalProps> | StatelessComponent<OriginalProps>
  ): ComponentClass<Props> {
    class Editable extends React.Component<InnerProps<OriginalProps>, State> {
      static contextTypes = {
        tux: React.PropTypes.object,
      }

      static childContextTypes = {
        model: React.PropTypes.object,
        readOnly: React.PropTypes.bool,
      }

      private isMounded: boolean

      state = {
        readOnly: true,
      }

      componentDidMount() {
        this.isMounded = true
        this.init()
      }

      componentWillUnmount() {
        this.isMounded = false
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
        return model
      }

      onLoad = async (model: any) => {
        return model
      }

      onSave = async (model: any) => {

      }
    // ...{
    //   model: this.props.model,
    //   readOnly: this.state.readOnly,
    // }

      render() {
        return <Editor {...this.props} />
      }
    }

    return Editable
  }
}

const Internal = ({ children }: { children: any }) => children || null

export default createEditable()(
  Internal
)
