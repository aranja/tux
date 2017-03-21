import React from 'react'
import { MegadraftEditor } from 'megadraft'

export interface Props {
  editorState: any,
  children: any,
  readOnly: boolean,
  placeholder?: string,
}

function noopSidebar() {
  return null
}

const DraftRenderer = ({ editorState, readOnly, children, placeholder, ...rest }: Props) => {
  const hasText = editorState.getCurrentContent().hasText()
  const hasFallback = children != null
  const props = {
    editorState: editorState,
    sidebarRendererFn: noopSidebar,
    readOnly: readOnly,
    ...rest,
  }

  if (!hasText && !hasFallback) {
    return <MegadraftEditor {...props} placeholder={placeholder} />
  }

  if (hasText) {
    return <MegadraftEditor {...props} />

  }

  return <span>{children}</span>
}

export default DraftRenderer
