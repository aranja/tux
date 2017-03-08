import React, { Component } from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

interface Dropdown {
  id: string
  value: string
  label: string
  helpText: string
  dropdownValues: Array<string>
  onChange: (e: React.FormEvent<any>) => void
}

export interface State {
  selectedValue: string | null,
}

class Dropdown extends Component<any, State> {
  state: State = {
    selectedValue: null,
  }

  componentDidMount() {
    const { value } = this.props
    console.log(value)
    this.setState({
      selectedValue: value
    })
  }

  handleChange = (value: string) => {
    const { onChange } = this.props

    this.setState({
      selectedValue: value
    })

    onChange(value)
  }

  render() {
    const { id, value, label, dropdownValues, onChange } = this.props
    const { selectedValue } = this.state

    return (
      <div className="Dropdown">
        <label className="InputLabel">{label}</label>
        <select
          onChange={(event: React.ChangeEvent<any>) => this.handleChange(event.target.value)}
        >
          {dropdownValues.map((value: string) => (
            <option key={value} selected={value === selectedValue}>{value}</option>
          ))}
        </select>
          <style jsx>{`
            .Dropdown {

            }
          `}</style>
      </div>
    )
  }

}

export default Dropdown
