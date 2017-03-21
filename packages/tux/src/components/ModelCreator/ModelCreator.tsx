import React from 'react'
import classNames from 'classnames'

import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxModal from '../TuxModal'
import { get, set } from '../../utils/accessors'

export interface ModelCreatorProps {
  modelId: string
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
    const { modelId } = this.props
    const model = await this.context.tux.adapter.createModel(modelId)

    const changed = await openModal(
      <TuxModal model={model} />
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

// import React from 'react'
//
// export default () => null
