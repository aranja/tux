import React, { Component } from 'react'
import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxFab from '../TuxFab'
import TuxModal from '../TuxModal'
import AlertBar from '../AlertBar'

export interface TuxProviderProps {
  adapter: {
    currentUser: Function
  }
  onChange: () => {}
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
    isMounted: false,
    isEditing: false,
    overlayIsActive: false,
    sidebarIsActive: false,
    isLoggedIn: false,
  }

  async componentDidMount() {
    const user = await this.props.adapter.currentUser()

    this.setState({
      isMounted: true,
      isLoggedIn: !!user,
    })
  }

  getChildContext() {
    return {
      tux: {
        isEditing: this.state.isLoggedIn && this.state.isEditing,
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

    const changed = await openModal(
      <TuxModal model={model} />
    )

    // Wait for openModal promise to resolve,
    // which means that the modal has been closed.
    this.setState({
      overlayIsActive: false
    })

    // TODO: Make consistent for all Editable components?
    if (changed) {
      this.props.onChange()
    }

    return changed
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

  renderTux() {
    const { isMounted, isEditing, sidebarIsActive, overlayIsActive } = this.state

    // Don't render tux on the server.
    if (!isMounted) {
      return null
    }

    return [
      isEditing && (
        <AlertBar key="alert" />
      ),
      <TuxFab key="sidebar"
        isEditing={isEditing}
        sidebarIsActive={sidebarIsActive}
        overlayIsActive={overlayIsActive}
        onClickEdit={this.onClickEdit}
      />,
      <ModalContainer key="modals" />,
    ]
  }

  render() {
    return (
      <div style={{paddingBottom: this.state.isEditing && 36}}>
        {this.props.children}
        {this.renderTux()}
      </div>
    )
  }
}

export default TuxProvider
