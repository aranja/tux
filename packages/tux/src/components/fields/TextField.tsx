import React from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

interface TextField {
  id: string
  value: string
  label: string
  helpText: string
  onChange: (e: React.FormEvent<any>) => void
}

const TextField = ({ id, value, label, onChange }: TextField) => (
  <div className="Input">
    <label className="InputLabel">{label}</label>
    <input
      className="InputField"
      id={id}
      label={label}
      onChange={(event: React.FormEvent<any>) => onChange(event.target.value)}
      value={value}
    />
      <style jsx>{`
        .Input {
          align-items: center;
          border-radius: 3px;
          display: flex;
          flex-wrap: wrap;
          margin: 20px 0;
        }

        .InputLabel {
          color: ${tuxInputStyles.labelTextColor};
          font-size: 16px;
          font-weight: 300;
          line-height: 24px;
          padding: 4px 0;
          text-transform: capitalize;
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
