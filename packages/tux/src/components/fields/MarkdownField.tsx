import React from 'react'
import { tuxColors, tuxInputStyles, tuxButtonStyles } from '../../styles'

interface MarkdownField {
  id: string
  value: string
  label: string
  helpText: string
  onChange: (e: React.FormEvent<any>) => void
}

const MarkdownField = ({ id, value, label, onChange }: MarkdownField) => (
  <div className="MarkdownField">
    <label className="MarkdownField-label">{label}</label>
    <textarea
      rows={12}
      className="MarkdownField-textArea"
      label={label}
      id={id}
      value={value}
      onChange={onChange}
    />
    <style jsx>{`
        .MarkdownField {
          align-items: baseline;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          margin: 20px 0;
        }

        .MarkdownField-label {
          color: ${tuxInputStyles.labelTextColor};
          font-size: 16px;
          font-weight: 300;
          line-height: 1.5;
          padding: 4px 0;
          text-transform: capitalize;
        }

        .MarkdownField-textArea {
          background: ${tuxColors.colorWhite};
          border: 1px solid ${tuxInputStyles.borderColor};
          border-radius: 3px;
          color: ${tuxColors.textDark};
          font-size: 16px;
          padding: 5px;
          width: 100%;
        }

        .MarkdownField-textArea:focus {
          border-color: ${tuxInputStyles.greenTheme.borderColor};
          outline: 1px solid ${tuxInputStyles.greenTheme.borderColor};
        }
      `}</style>
  </div>
)

export default MarkdownField
