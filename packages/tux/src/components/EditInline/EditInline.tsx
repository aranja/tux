import React from 'react'
import DraftRenderer from './DraftRenderer'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'
import { editorStateFromRaw } from 'megadraft'
import { get } from '../../utils/accessors'

export type Props = EditableProps & {
  field: string | Array<string>,
}

export default createEditable<Props>()(({ children, model, field }: Props) => {
  const value = get(model, field)
  if (value) {
    return (
      <DraftRenderer
        editorState={editorStateFromRaw(value)}
        readOnly={true}
      />
    )
  } else {
    return children
  }
})
