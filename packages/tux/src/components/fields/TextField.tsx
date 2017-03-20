import React from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

interface TextField {
  id: string
  value: string
  onChange: (e: React.FormEvent<any>) => void
}

const TextField = ({ id, value, onChange }: TextField) => (
  <div className="Input">
    <input
      className="InputField"
      id={id}
      onChange={(event: React.FormEvent<HTMLSelectElement>) => onChange(event.target.value)}
      value={value}
    />
      <style jsx>{`
        .Input {
          align-items: center;
          border-radius: 3px;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .InputField {
          background: ${tuxColors.colorWhite};
          border: 1px solid ${tuxInputStyles.borderColor};
          border-radius: 3px;
          color: ${tuxColors.textDark};
          font-size: 16px;
          padding: 5px;
          line-height: 1.5;
          width: 100%;
        }

        .InputField:focus {
          border-color: ${tuxInputStyles.greenTheme.borderColor};
          outline: 1px solid ${tuxInputStyles.greenTheme.borderColor};
        }
      `}</style>
  </div>
)

export default TextField
