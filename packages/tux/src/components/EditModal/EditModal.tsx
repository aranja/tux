import React from 'react'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'

export default createEditable()(({ children }: EditableProps) => (
  <span>{children}</span>
))
