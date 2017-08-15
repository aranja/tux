import React from 'react'
import { Theme, input, button } from '../../theme'
import TextField from 'material-ui/TextField'

interface MarkdownField {
  id: string
  value: string
  onChange: (value: string) => void
}

const DEFAULT_VALUE = ''

const MarkdownField = ({ id, value, onChange }: MarkdownField) => (
    <TextField
      hintText="Markdown text"
      floatingLabelText="Markdown text"
      multiLine={true}
      value={value ? value : DEFAULT_VALUE}
      rows={2}
      onChange={(event, value) => onChange(value)}
      id={id}
      fullWidth
    />
)

export default MarkdownField
