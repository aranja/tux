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
  selectedValue: string | undefined,
}

class Dropdown extends Component<any, State> {
  state: State = {
    selectedValue: undefined,
  }

  componentDidMount() {
    const { value } = this.props

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
        <label className="Dropdown-inputLabel">{label}</label>
        <select
          className="Dropdown-field"
          onChange={(event: React.ChangeEvent<any>) => this.handleChange(event.target.value)}
          value={selectedValue}
        >
          {dropdownValues.map((value: string) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <style jsx>{`
          .Dropdown-inputLabel {
            color: ${tuxInputStyles.labelTextColor};
            font-size: 16px;
            font-weight: 300;
            line-height: 24px;
            padding: 4px 0;
            text-transform: capitalize;
          }

          .Dropdown-field {
            appearance: none;
            background: white;
            display: block;
            appearance: none;
            border: 1px solid ${tuxInputStyles.borderColor};
            border-radius: 3px;
            color: ${tuxColors.textDark};
            font-family: -apple-system, BlinkMacSystemFont, "Source Sans Pro", "sans-serif";
            font-size: 16px;
            font-weight: 300;
            line-height: 1.5;
            padding: 5px;
            width: 260px;
          }
        `}</style>
      </div>
    )
  }

}

export default Dropdown
