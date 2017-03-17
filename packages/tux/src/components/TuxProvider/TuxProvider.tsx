import React, { Component } from 'react'
import classNames from 'classnames'
import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxSidebar from '../TuxSidebar'
import TuxModal from '../TuxModal'
import AlertBar from '../AlertBar'

export interface TuxProviderProps {
  adapter: {
    currentUser: Function
  }
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
    isLoggedIn: false,
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

  async componentDidMount() {
    const user = await this.props.adapter.currentUser()

    if (user) {
      this.setState({
        isLoggedIn: true,
      })
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
    // Todo set isEditing state in localStorage
    const { isEditing, isLoggedIn } = this.state

    if (isLoggedIn) {
      this.setState({
        isEditing: !isEditing
      })
    }
  }

  render() {
    const { isEditing, sidebarIsActive, overlayIsActive } = this.state
    return (
      <div className="TuxProvider" style={{paddingTop: isEditing && 36}}>
        {isEditing && (
          <AlertBar />
        )}
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
