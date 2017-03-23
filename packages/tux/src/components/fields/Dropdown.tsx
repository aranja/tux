import React, { Component } from 'react'
import { tuxColors, tuxInputStyles, tuxButtonStyles } from '../../styles'

interface Dropdown {
  id: string
  value: string
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
    const { id, dropdownValues, onChange } = this.props
    const { selectedValue } = this.state

    return (
      <div className="Dropdown-wrapper">
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

          .Dropdown {
            display: inline-block;
            font-size: 16px;
            position: relative;
          }

          .Dropdown select {
            appearance: button;
            background-color: white;
            border-radius: 3px;
            border: 1px solid ${tuxInputStyles.borderColor};
            color: inherit;
            cursor: pointer;
            font-size: inherit;
            margin: 0;
            padding-right: 40px;
            padding: 8px;
            text-indent: 0.01px;
            width: 260px;
          }

          .Dropdown::before,
          .Dropdown::after {
            content: "";
            font-family: Arial, 'sans-serif';
            position: absolute;
            pointer-events: none;
          }

          .Dropdown::after {
            bottom: 0;
            color: ${tuxButtonStyles.textColor};
            content: "▼";
            font-size: 10px;
            height: 10px;
            line-height: 1;
            margin: auto;
            right: 12px;
            top: 2px;
          }

          .Dropdown::before {
            background: ${tuxButtonStyles.backgroundColor};
            border-radius: 0 3px 3px 0;
            border: 1px solid ${tuxInputStyles.borderColor};
            bottom: 0;
            right: 0;
            top: 0;
            width: 32px;
          }
        `}</style>
      </div>
    )
  }

}

export default Dropdown
