import React from 'react'
import { tuxColors, tuxInputStyles, tuxButtonStyles } from '../../styles'

interface MarkdownField {
  id: string
  value: string
  onChange: (e: React.FormEvent<any>) => void
}

const defaultValue = ''

const MarkdownField = ({ id, value, onChange }: MarkdownField) => (
  <div className="MarkdownField">
    <textarea
      rows={12}
      className="MarkdownField-textArea"
      id={id}
      value={value ? value : defaultValue}
      onChange={(event: React.FormEvent<any>) => onChange(event.target.value)}
    />
    <style jsx>{`
        .MarkdownField {
          align-items: baseline;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          margin-bottom: 20px;
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
