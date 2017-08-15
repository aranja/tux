import React, { Component } from 'react'
import classNames from 'classnames'
import { Theme, input } from '../../theme'
import { decelerationCurve, sharpCurve } from '../../utils/curves'
import TextField from 'material-ui/TextField'

const DEFAULT_VALUE = ''

export interface Props {
  id: string
  value: string
  onChange: (e: string) => void
}

export interface State {
  hasFocus: boolean
}

class Input extends Component<Props, State> {
  state = {
    hasFocus: false
  }

  handleFocus = () => {
    const { hasFocus } = this.state

    this.setState({
      hasFocus: true
    })
  }

  handleBlur = () => {
    const { hasFocus } = this.state

    this.setState({
      hasFocus: false
    })
  }

  render() {
    const { hasFocus } = this.state
    const { id, onChange, value } = this.props
    return (
      <TextField
        hintText="Input title"
        floatingLabelText="Title"
        id={id}
        onChange={event => onChange(event.target.value)}
        value={value || DEFAULT_VALUE}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    )
  }
}

export default Input
