import React from 'react'
import { text, input } from '../../colors'

interface MarkdownField {
  id: string
  value: string
  onChange: (value: string) => void
}

const MarkdownField = ({ id, value, onChange }: MarkdownField) => (
  <div className="MarkdownField">
    <textarea
      rows={12}
      className="MarkdownField-textArea"
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    <style jsx>{`
        .MarkdownField {
          align-items: baseline;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }

        .MarkdownField-textArea {
          background: #FFF;
          border: 1px solid ${input.default.border};
          color: ${text.dark};
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
