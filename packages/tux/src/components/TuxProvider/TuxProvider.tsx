import React, { Component } from 'react'
import PropTypes from 'prop-types'
import adminOnly from '../../utils/adminOnly'

export interface TuxProviderProps {
  adapter: any
  onChange?(): void
}

class TuxProvider extends Component<TuxProviderProps, any> {
  static childContextTypes = {
    tux: PropTypes.shape({
      isEditing: PropTypes.bool.isRequired,
      editModel: PropTypes.func.isRequired,
      adapter: PropTypes.object.isRequired,
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
