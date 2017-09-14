import React from 'react'
import { EditableProps } from '../../interfaces'

export default ({ isEditing, tux, model, ...props }: EditableProps) => (
  <div {...props} />
)
