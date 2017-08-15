import React, { Component } from 'react'
import { Theme, input, button } from '../../theme'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const DEFAULT_VALUE = ''

interface Dropdown {
  id: string
  value: string
  dropdownValues: Array<string>
  onChange: (e: React.FormEvent<any>) => void
}

export interface State {
  value: string | undefined
}

class Dropdown extends Component<any, State> {
  state: State = {
    value: undefined
  }

  componentDidMount() {
    const { value } = this.props

    this.setState({
      value: value ? value : DEFAULT_VALUE
    })
  }

  handleChange = (event: React.ChangeEvent<any>, index: number, value: string) => {
    const { onChange } = this.props

    this.setState({
      value
    })

    onChange(value)
  }

  render() {
    const { id, dropdownValues, onChange } = this.props
    const { value } = this.state

    return (
      <SelectField
        floatingLabelText="Dropdown"
        value={value}
        onChange={(event, index, value) => this.handleChange(event, index, value)}
      >
        {dropdownValues.map((value: string) => {
          return <MenuItem key={value} value={value} primaryText={value} />
        })}
      </SelectField>
    )
  }
}

export default Dropdown
