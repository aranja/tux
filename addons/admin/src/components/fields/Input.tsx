import React, { Component } from 'react'
import classNames from 'classnames'
import { Theme, input } from '../../theme'
import { decelerationCurve, sharpCurve } from '../../utils/curves'

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
    hasFocus: false,
  }

  handleFocus = () => {
    const { hasFocus } = this.state

    this.setState({
      hasFocus: true,
    })
  }

  handleBlur = () => {
    const { hasFocus } = this.state

    this.setState({
      hasFocus: false,
    })
  }

  render() {
    const { hasFocus } = this.state
    const { id, onChange, value } = this.props
    return (
      <div className={classNames('Input', hasFocus && 'has-focus')}>
        <input
          className="Input-field"
          id={id}
          onChange={event => onChange(event.target.value)}
          value={value || DEFAULT_VALUE}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <hr className="Input-underline Input-underline--passive" />
        <hr className="Input-underline Input-underline--active" />
        <style jsx>{`
          .Input {
            width: 100%;
            position: relative;
          }

          .Input-field {
            background: #fff;
            border: 0;
            font-size: 15px;
            padding: 0;
            padding-bottom: 8px;
            width: 100%;
          }

          .Input-field:focus {
            outline: 0;
          }

          .Input-underline {
            border: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            width: 100%;
          }

          .Input-underline--passive {
            border-bottom: 1px solid #e0e0e0;
            margin: 0;
          }

          .Input-underline--active {
            transition: transform 0.25s cubic-bezier(${decelerationCurve});
            border-bottom: 1px solid ${Theme.primary};
            margin: 0;
            transform: scaleX(0);
          }

          .Input.has-focus .Input-underline--active {
            transform: scaleX(1);
          }
        `}</style>
      </div>
    )
  }
}

export default Input
