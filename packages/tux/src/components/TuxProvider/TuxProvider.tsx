import React = require('react')
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ModalContainer, { openModal } from '../TuxModalContainer'
import TuxBar from '../TuxBar'
import TuxModal from '../TuxModal'

interface Props {
  adapter: Object
}

class TuxProvider extends React.Component<Props, any> {
  static childContextTypes = {
    tux: React.PropTypes.shape({
      isEditing: React.PropTypes.bool.isRequired,
      editModel: React.PropTypes.func.isRequired,
      adapter: React.PropTypes.object.isRequired,
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
