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

  createModel = async() => {
    const { model } = this.props

    const changed = await openModal(
      <TuxModal model={model} isNew />
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.createModel}>+</button>
        <style jsx>{`
          .ModelCreator-todo-styleMePlz {

          }
        `}</style>
      </div>
    )
  }
}

export default ModelCreator
