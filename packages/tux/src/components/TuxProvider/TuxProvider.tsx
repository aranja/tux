import React, { Component } from 'react'
import classNames from 'classnames'
import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxSidebar from '../TuxSidebar'
import TuxModal from '../TuxModal'

export interface TuxProviderProps {
  adapter: Object
}

class TuxProvider extends Component<TuxProviderProps, any> {
  static childContextTypes = {
    tux: React.PropTypes.shape({
      isEditing: React.PropTypes.bool.isRequired,
      editModel: React.PropTypes.func.isRequired,
      adapter: React.PropTypes.object.isRequired,
    }),
  }

  state = {
    isEditing: false,
    overlayIsActive: false,
    sidebarIsActive: false,
  }

  getChildContext() {
    return {
      tux: {
        isEditing: this.state.isEditing,
        editModel: this.editModel,
        adapter: this.props.adapter,
      },
    }
  }

  editModel = async (model: any) => {
    // Modal has been opened.
    this.setState({
      overlayIsActive: true
    })

    await openModal(
      <TuxModal model={model} />
    )

    // Wait for openModal promise to resolve,
    // which means that the modal has been closed.
    this.setState({
      overlayIsActive: false
    })
  }

  onClickEdit = () => {
    const { isEditing } = this.state

    this.setState({
      isEditing: !isEditing
    })
  }

  render() {
    const { isEditing, sidebarIsActive, overlayIsActive } = this.state

    return (
      <div className="TuxProvider">
        <TuxSidebar
          isEditing={isEditing}
          sidebarIsActive={sidebarIsActive}
          overlayIsActive={overlayIsActive}
          onClickEdit={this.onClickEdit}
        />
        {this.props.children}
        <ModalContainer />
      </div>
    )
  }
}

export default TuxProvider
