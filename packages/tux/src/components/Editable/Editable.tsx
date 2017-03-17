import React from 'react'

export interface EditableProps {
  model: any,
  children: any,
}

class Editable extends React.Component<EditableProps, any> {
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

  onLoad = async (model: any) => {
    return model
  }

  onSave = async (model: any) => {

  }

  render() {
    const { children } = this.props
    return children || null
  }
}

export default Editable
