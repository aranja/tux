import React from 'react'
import SlateRenderer from '../../slate/SlateRenderer'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'
import { get } from '../../utils/accessors'
import { deserialize, Format } from '../../slate/serializers'

export type Props = EditableProps & {
  field: string | Array<string>,
  format: Format
}

export default createEditable<Props>()(({ children, model, field, format }: Props) => {
  const value = get(model, field)
  let state = null
  try {
    state = deserialize(value, format)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error('Could not parse content value', value, err)
  }

  if (state) {
    return (
      <SlateRenderer
        state={state}
        readOnly={true}
      />
    )
  } else {
    return children || null
  }
})
