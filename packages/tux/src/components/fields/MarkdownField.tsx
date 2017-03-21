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
          color: ${tuxColors.textDark};
          font-size: 16px;
          font-weight: 300;
          line-height: 1.4;
          padding: 8px;
          width: 100%;
        }
      `}</style>
  </div>
)

export default MarkdownField
