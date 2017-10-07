import React from 'react'
import PropTypes from 'prop-types'
import { Editable, EditInline, ModelCreator } from 'tux-addon-admin'

import './Home.css'

class Home extends React.Component {
  static contextTypes = {
    tux: PropTypes.any,
  }
  constructor(props, context) {
    super(props, context)
    this.state = { model: null }
  }
  async componentDidMount() {
    const { tux: { adapter: { queryApi } } } = this.context
    const model = await queryApi.getEntry('home')
    this.setState({ model })
  }
  render() {
    const { model } = this.state
    return (
      <div>
        {model ? (
          <Editable model={model}>
            <h1>
              <EditInline field="data.title">
                Tux - LocalStorage Adapter
              </EditInline>
            </h1>
            <p>
              <EditInline field="data.description">
                This adapter run on top of localStorage. It does not, therefore
                run on the server. Try editing the page and refreshing.
              </EditInline>
            </p>
          </Editable>
        ) : (
          'Loading...'
        )}
      </div>
    )
  }
}

export default Home
