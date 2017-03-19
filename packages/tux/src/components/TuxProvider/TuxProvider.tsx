import React, { Component } from 'react'
import adminOnly from '../../utils/adminOnly'

export interface TuxProviderProps {
  adapter: any
}

class TuxProvider extends Component<TuxProviderProps, any> {
  static childContextTypes = {
    tux: React.PropTypes.shape({
      isEditing: React.PropTypes.bool.isRequired,
      editModel: React.PropTypes.func.isRequired,
      adapter: React.PropTypes.object.isRequired,
    }),
  }

  getChildContext() {
    return {
      tux: {
        isEditing: false,
        editModel: this.editModel,
        adapter: this.props.adapter,
      },
    }
  }

  editModel = adminOnly('context.tux.editModel')

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default TuxProvider
