import React from 'react'
import { Plugin } from 'slate-react'
import Toolbar from './Toolbar'

/**
 * Render toolbar above selection.
 */
function HoverToolbar(): Plugin {
  return {
    renderEditor: (props, editor) => (
      <span>
        {props.children}
        <Toolbar key="toolbar" value={props.value} onChange={editor.onChange} />
      </span>
    ),
  }
}

export default HoverToolbar
