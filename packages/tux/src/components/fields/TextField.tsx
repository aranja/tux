import React from 'react'
import { tuxColors, tuxInput } from '../../colors'

interface TextField {
  id: string
  value: string
  onChange: (e: React.SyntheticEvent<any>) => void
}

const TextField = ({ id, value, onChange }: TextField) => (
  <div className="Input">
    <input
      className="InputField"
      id={id}
      onChange={(event) => onChange(event.target.value)}
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
          background: ${tuxColors.white};
          border: 1px solid ${tuxInput.border};
          border-radius: 3px;
          color: ${tuxColors.textDark};
          font-size: 16px;
          padding: 5px;
          line-height: 1.5;
          width: 100%;
        }

        .InputField:focus {
          border-color: ${tuxInput.greenTheme.border};
          outline: 1px solid ${tuxInput.greenTheme.border};
        }
      `}</style>
  </div>
)

export default TextField
