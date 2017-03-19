import React from 'react'
import DraftRenderer from './DraftRenderer'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../Editable'
import { editorStateFromRaw } from 'megadraft'
import { get } from '../../utils/accessors'

export type Props = EditableProps & {
  field: string | Array<string>,
}

export default createEditable<Props>()(({ children, model, field }: Props) => (
  <DraftRenderer
    editorState={editorStateFromRaw(get(model, field))}
    readOnly={true}
    children={children}
  />
))
