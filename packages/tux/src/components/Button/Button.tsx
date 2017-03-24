import React, { Component } from 'react'
import classNames from 'classnames'
import { button } from '../../colors'
import { fade, lighten } from '../../utils/color'

export interface ButtonProps {
  type: string
  primary: boolean
  flat: boolean
  raised: boolean
  onClick: (e: React.SyntheticEvent<any>) => void
  children: any
}

class Button extends Component<ButtonProps, any> {
  constructor(props: ButtonProps, context: Object) {
    super(props, context)
    this.theme = this.context.tux.theme.btn
  }

  private theme

  static contextTypes = {
    tux: React.PropTypes.object,
  }

  render() {
    const { type, flat = true, primary, raised, onClick, children } = this.props

    return (
      <button
      className={
        classNames('Button',
        raised ? 'Button--raised' : 'Button--flat',
        primary && 'button--primary button--raised')}
      type={type}
      onClick={onClick}>
      {children}
      <style jsx>{`
        .Button {
          background: transparent;
          border: 0;
          border-radius: 2px;
          color: ${this.theme.color};
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.3;
          margin: 0;
          padding: 10px 20px;
          text-align: center;
          transition: all 0.25s;
          vertical-align: baseline;
        }

        .Button--flat:hover {
          background: rgba(220, 221, 222, 0.4);
        }

        .Button--raised {
          background: ${this.theme.raisedBackgroundColor};
          border: 1px solid ${this.theme.raisedBorderColor};
          box-shadow: ${this.theme.raisedBoxShadow};
        }

        .Button + .Button {
          margin-left: 16px;
        }

        .Button--primary {
          color: ${this.theme.primaryColor};
          background: ${this.theme.primaryBackgroundColor};
          border-color: ${this.theme.primaryBorderColor};
        }

        .Button--primary:hover {
          background: ${this.theme.primaryHoverBackgroundColor};
        }
        `}</style>
        </button>
      )
  }

}


export default Button
