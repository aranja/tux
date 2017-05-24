import React from 'react'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'

export default createEditable()(({ isEditing, tux, model, ...props }: EditableProps) => (
  <div {...props} />
))
