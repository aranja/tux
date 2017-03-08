import React, { Component } from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

export interface State {
  trueOrFalse: boolean | null,
}

class Boolean extends Component<any, State> {
  state: State = {
    trueOrFalse: null,
  }

  componentDidMount() {
    const { value } = this.props

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
          <input
            className="Boolean-input"
            id={trueLabel}
            type="checkbox"
            checked={trueOrFalse === true}
            onChange={(event) => {this.onChangeValue(event.target.checked)}}
          />
          <div className="Boolean-inputIndicator"></div>
        </label>

        <label
          className="Boolean is-false"
          htmlFor={falseLabel}>
            {falseLabel}
          <input
            className="Boolean-input"
            id={falseLabel}
            type="checkbox"
            checked={trueOrFalse === false}
            onChange={(event) => {this.onChangeValue(!event.target.checked)}}
          />
          <div className="Boolean-inputIndicator"></div>
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

        .Boolean-input {
          opacity: 0;
          position: absolute;
          z-index: -1;
          box-sizing: border-box;
          padding: 0;
        }

        .Boolean-inputLabel {
          color: ${tuxInputStyles.labelTextColor};
          font-size: 16px;
          font-weight: 300;
          line-height: 24px;
          padding: 4px 0;
          text-transform: capitalize;
        }

        .Boolean-inputIndicator {
          background: ${tuxColors.colorSnow};
          border: 1px solid ${tuxInputStyles.borderColor};
          border-radius: 2px;
          height: 20px;
          left: 0;
          position: absolute;
          top: 2px;
          width: 20px;
        }

        .Boolean-inputIndicator::after {
          border: solid ${tuxColors.colorWhite};
          border-width: 0 2px 2px 0;
          content: '';
          height: 10px;
          opacity: 0;
          left: 7px;
          position: absolute;
          top: 3px;
          transform: rotate(45deg) scale(0.5);
          transform-origin: center;
          width: 5px;
        }

        .Boolean-input:checked ~ .Boolean-inputIndicator {
          background: ${tuxColors.colorGreen};
          border: 1px solid ${tuxColors.colorGreen};
        }

        .Boolean-input:checked ~ .Boolean-inputIndicator::after {
          opacity: 1;
          transform: rotate(45deg) scale(1);
          transition: transform 0.1s cubic-bezier(0.17, 0.67, 0.57, 1.17);
        }
      `}</style>
      </div>
    )
  }
}

export default Boolean
