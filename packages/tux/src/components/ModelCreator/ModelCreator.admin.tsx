import React from 'react'
import classNames from 'classnames'

import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxModal from '../TuxModal'
import { get, set } from '../../utils/accessors'

export interface ModelCreatorProps {
  type: string
}

class ModelCreator extends React.Component<ModelCreatorProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  constructor(props: ModelCreatorProps) {
    super(props)

    this.state = {
      meta: null
    }
  }

  createModel = async() => {
    const { type } = this.props
    const newModel = await this.context.tux.adapter.createEmptyModel(type)

    const changed = await openModal(
      <TuxModal model={newModel} isNew />
    )
  }

  render() {
    return (
      <div>
        <button onClick={this.createModel}>+</button>
        <style jsx>{`

        `}</style>
      </div>
    )
  }
}

export default ModelCreator
