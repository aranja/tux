import React = require('react')
import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxSidebar from '../TuxSidebar'
import TuxModal from '../TuxModal'

export interface TuxProviderProps {
  adapter : Object
}

class TuxProvider extends React.Component<TuxProviderProps, any> {
  static childContextTypes = {
    tux: React.PropTypes.shape({
      isEditing: React.PropTypes.bool.isRequired,
      editModel: React.PropTypes.func.isRequired,
      adapter: React.PropTypes.object.isRequired,
    }),
  }

  state = {
    isEditing: false,
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

  editModel = (model : any) => {
    return openModal(
      <TuxModal model={model} />
    )
  }

  onClickEdit = () => {
    const { isEditing } = this.state

    this.setState({
      isEditing: !isEditing
    })
  }

  render() {
    const { isEditing } = this.state

    return (
      <div className="TuxProvider" style={{display: 'flex'}}>
        <TuxSidebar isEditing={isEditing} onClickEdit={this.onClickEdit} />
        {this.props.children}
        <ModalContainer />
      </div>
    )
  }
}

export default TuxProvider
