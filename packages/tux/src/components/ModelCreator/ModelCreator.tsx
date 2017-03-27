import React from 'react'
import classNames from 'classnames'

import { openModal } from '../TuxModalContainer'
import TuxModal from '../TuxModal'
import { get, set } from '../../utils/accessors'

export interface ModelCreatorProps {
  model: string
}

class ModelCreator extends React.Component<ModelCreatorProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  shouldBeVisible() {
    const { tux } = this.context
    if (!tux) {
      return false
    }

    return tux.adapter.currentUser() && tux.isEditing
  }

  createModel = async() => {
    const { model } = this.props

    const changed = await openModal(
      <TuxModal model={model} isNew />
    )
  }

  render() {
    const { model, children } = this.props
    const isVisible = this.shouldBeVisible()

    if (isVisible) {
      if (children instanceof Function) {
        return children(this.createModel)
      }
      return (
        <div>
          <button onClick={this.createModel}>Create new {model}</button>
        </div>
      )
    }
    return null
  }
}

export default ModelCreator
