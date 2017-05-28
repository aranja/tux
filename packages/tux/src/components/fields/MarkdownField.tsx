import React from 'react'
import { Theme, input, button } from '../../theme'

interface MarkdownField {
  id: string
  value: string
  onChange: (value: string) => void
}

const DEFAULT_VALUE = ''

const MarkdownField = ({ id, value, onChange }: MarkdownField) => (
  <div className="MarkdownField">
    <textarea
      rows={12}
      className="MarkdownField-textArea"
      id={id}
      value={value ? value : DEFAULT_VALUE}
      onChange={event => onChange(event.target.value)}
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
          border: 1px solid ${input.border};
          color: ${Theme.textDark};
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
