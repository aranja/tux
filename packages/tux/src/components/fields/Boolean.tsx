import React, { Component } from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'
import Checkbox from './Checkbox'

export interface State {
  trueOrFalse: boolean | null,
}

class Boolean extends Component<any, State> {
  state: State = {
    trueOrFalse: null,
  }

  componentDidMount() {
    const { value } = this.props
    console.log(value)
    this.setState({
      trueOrFalse: value
    })
  }

  onChangeValue = (checked: boolean) => {
    const { onChange } = this.props

    this.setState({
      trueOrFalse: checked
    })
    onChange(checked)
  }

  render() {
    const { trueOrFalse } = this.state
    const { id, label, boolLabels } = this.props
    const trueLabel = boolLabels[0]
    const falseLabel = boolLabels[1]

    return (
      <div className="Boolean-wrapper">
        <label className="Boolean-inputLabel">
          {label}
        </label>
        <label
          className="Boolean is-true"
          htmlFor={trueLabel}>
            {trueLabel}
            <Checkbox
              id={trueLabel}
              checked={trueOrFalse === true}
              onChange={(event) => {this.onChangeValue(event.target.checked)}}
            />
        </label>

        <label
          className="Boolean is-false"
          htmlFor={falseLabel}>
            {falseLabel}
            <Checkbox
              id={falseLabel}
              checked={trueOrFalse === false}
              onChange={(event) => {this.onChangeValue(event.target.checked)}}
            />
        </label>

      <style jsx>{`
        .Boolean-wrapper {
            margin: 20px 0;
        }

        .Boolean {
          cursor: pointer;
          display: block;
          font-size: 15px;
          line-height: 24px;
          margin-bottom: 5px;
          padding-left: 28px;
          position: relative;
          user-select: none;
        }

        .Boolean-inputLabel {
          color: ${tuxInputStyles.labelTextColor};
          font-size: 16px;
          font-weight: 300;
          line-height: 24px;
          padding: 4px 0;
          text-transform: capitalize;
        }

      `}</style>
      </div>
    )
  }
}

export default Boolean
