import React from 'react'
import { tuxColors, tuxInput, tuxButton } from '../../colors'

interface MarkdownField {
  id: string
  value: string
  onChange: (e: React.FormEvent<any>) => void
}

const MarkdownField = ({ id, value, onChange }: MarkdownField) => (
  <div className="MarkdownField">
    <textarea
      rows={12}
      className="MarkdownField-textArea"
      id={id}
      value={value}
      onChange={(event: React.FormEvent<any>) => onChange(event.target.value)}
    />
    <style jsx>{`
        .MarkdownField {
          align-items: baseline;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }

        .MarkdownField-textArea {
          background: ${tuxColors.white};
          border: 1px solid ${tuxInput.border};
          border-radius: 3px;
          color: ${tuxColors.textDark};
          font-size: 16px;
          padding: 5px;
          width: 100%;
        }

        .MarkdownField-textArea:focus {
          border-color: ${tuxInput.greenTheme.border};
          outline: 1px solid ${tuxInput.greenTheme.border};
        }
      `}</style>
  </div>
)

export default MarkdownField
