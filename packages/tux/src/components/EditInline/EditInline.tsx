import React from 'react'
import SlateRenderer from './SlateRenderer'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'
import { Raw } from 'slate'
import { get } from '../../utils/accessors'

export type Props = EditableProps & {
  field: string | Array<string>,
}

export default createEditable<Props>()(({ children, model, field }: Props) => {
  const value = get(model, field)
  if (value) {
    return (
      <SlateRenderer
        state={Raw.deserialize(value)}
        readOnly={true}
      />
    )
  } else {
    return children || null
  }
})
