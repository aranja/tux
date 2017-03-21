import React from 'react'
import classNames from 'classnames'
import { tuxColors, tuxButton } from '../../colors'
import { fade, lighten } from '../../utils/color'

export interface Button {
  type: string
  themeColor: string
  flat: boolean
  onClick: (e: React.SyntheticEvent<any>) => void
  children: any
}


const Button = ({ type, flat, themeColor, raised, onClick, children }: Button) => {
  const classes = raised ? 'Button--raised' : 'Button--flat'

  return (
    <button className={classNames('Button', classes)} type={type} data-theme-color={themeColor}>
    {children}
    <style jsx>{`
      .Button {
        background: transparent;
        border: 0;
        border-radius: 2px;
        color: ${tuxButton.text};
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
        background: ${tuxButton.background};
        border: 1px solid ${tuxButton.border};
        box-shadow: ${fade(tuxColors.black, 0.1)} 0px 1px 6px,
                    ${fade(tuxColors.black, 0.1)} 0px 1px 4px;
      }

      .Button + .Button {
        margin-left: 16px;
      }

      .Button[data-theme-color="green"] {
        color: ${tuxButton.greenTheme.text};
        background: ${tuxButton.greenTheme.background};
        border-color: ${tuxButton.greenTheme.border};
      }

      .Button[data-theme-color="green"]:hover {
        background: ${lighten(tuxButton.greenTheme.background, 0.2)};
      }
      `}</style>
      </button>
    )
}


export default Button
