import React from 'react'
import classNames from 'classnames'
import { button } from '../../theme'
import { fade, lighten } from '../../utils/color'

export interface ButtonProps {
  type: string
  themeColor: string
  flat: boolean
  raised: boolean
  onClick: (e: React.SyntheticEvent<any>) => void
  children: any
}


const Button = ({ type, themeColor, flat = true, raised, onClick, children }: ButtonProps) => {
  const classes = raised ? 'Button--raised' : 'Button--flat'

  return (
    <button
    className={classNames('Button', classes)}
    type={type}
    onClick={onClick}
    data-theme-color={themeColor}>
      {children}
      <style jsx>{`
        .Button {
          background: transparent;
          border: 0;
          border-radius: 2px;
          color: ${button.text};
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
          background: ${button.background};
          border: 1px solid ${button.border};
          box-shadow: ${fade('#000', 0.1)} 0px 1px 6px,
                      ${fade('#000', 0.1)} 0px 1px 4px;
        }

        .Button + .Button {
          margin-left: 16px;
        }

        .Button[data-theme-color="green"] {
          color: ${button.greenTheme.text};
          background: ${button.greenTheme.background};
          border-color: ${button.greenTheme.border};
        }

        .Button[data-theme-color="green"]:hover {
          background: ${lighten(button.greenTheme.background, 0.2)};
        }
        `}</style>
      </button>
    )
}


export default Button
