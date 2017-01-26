import React, { Component, PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxBar from '../TuxBar'
import TuxModal from '../TuxModal'

interface Props {
  adapter: Object
}

class TuxProvider extends Component<Props, any> {
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
        isEditing: true,
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

  render() {
    return (
      <div>
        {this.props.children}
        <MuiThemeProvider>
          <div>
            <ModalContainer />
            <TuxBar />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default TuxProvider
