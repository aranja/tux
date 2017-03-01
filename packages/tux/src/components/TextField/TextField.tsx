import React from 'react'

import { InputStyles, buttonStyles, tuxColors } from '../../styles'

interface Field {
  id: string
  value: string
  label: string
  helpText: string
  onChange: (value: any, type : {id : string}) => void
}

const TextField = ({ id, value, label, helpText, onChange }: Field) => (
  <div className="Input">
    <label className="InputLabel">{label}</label>
    <input
      className="InputField"
      id={id}
      label={label}
      onChange={(event) => onChange(event.target.value, { id })}
      value={value}
    />
    <style jsx>{`
      .InputLabel {
        color: ${InputStyles.labelTextColor};
        font-size: 14px;
        line-height: 24px;
      }
      .InputField {
        border-radius: 3px;
        border: 1px solid ${InputStyles.borderColor};
        color: ${tuxColors.textDark};
        margin: 5px 0;
        padding: 10px;
        width: 100%;
      }
      `}</style>
    </div>
  )

  export default TextField
