import React, { Component } from 'react'
import { tuxColors, tuxInputStyles, tuxButtonStyles } from '../../styles'

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
      <div className="Dropdown-wrapper">
        <label className="Dropdown-inputLabel">{label}</label>
        <div className="Dropdown">
          <select
            onChange={(event: React.ChangeEvent<any>) => this.handleChange(event.target.value)}
            value={selectedValue}
          >
            {dropdownValues.map((value: string) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <style jsx>{`

          .Dropdown-wrapper {
            display: inline-flex;
            flex-direction: column;
            margin-bottom: 20px;
          }

          .Dropdown-inputLabel {
            color: ${tuxInputStyles.labelTextColor};
            font-size: 16px;
            font-weight: 300;
            line-height: 24px;
            padding: 5px 0;
            text-transform: capitalize;
          }

          /* Custom dropdown */
          .Dropdown {
            display: inline-block;
            font-size: 16px;
            position: relative;
            vertical-align: middle;
          }

          .Dropdown select {
            background-color: white;
            border: 1px solid ${tuxInputStyles.borderColor};
            color: inherit;
            font-size: inherit;
            padding: 8px;
            padding-right: 40px;
            margin: 0;
            border-radius: 3px;
            text-indent: 0.01px;
            -webkit-appearance: button;
          }

          .Dropdown::before,
          .Dropdown::after {
            content: "";
            font-family: Arial, 'sans-serif';
            position: absolute;
            pointer-events: none;
          }

          .Dropdown::after { /*  Custom dropdown arrow */
            bottom: 0;
            content: "▼";
            font-size: 10px;
            height: 10px;
            line-height: 1;
            margin: auto;
            right: 12px;
            top: 0;
          }

          .Dropdown::before { /*  Custom dropdown arrow cover */
            background: ${tuxButtonStyles.backgroundColor};
            border-radius: 0 3px 3px 0;
            border: 1px solid ${tuxInputStyles.borderColor};
            bottom: 0;
            right: 0;
            top: 0;
            width: 32px;
          }

          .Dropdown::after {
            color: ${tuxButtonStyles.textColor};
          }
        `}</style>
      </div>
    )
  }

}

export default Dropdown
