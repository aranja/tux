import React from 'react'
import { MegadraftEditor } from 'megadraft'

export interface Props {
  editorState: any,
  children: any,
  readOnly: boolean,
}

function noopSidebar() {
  return null
}

const DraftRenderer = ({ editorState, readOnly, children, ...rest }: Props) => {
  if (editorState.getCurrentContent().hasText()) {
    return (
      <MegadraftEditor
        editorState={editorState}
        sidebarRendererFn={noopSidebar}
        readOnly={readOnly}
        {...rest}
      />
    )
  }

  return <span>{children}</span>
}

export default DraftRenderer
