import React from 'react'
import { Plugin } from 'slate'
import Toolbar from './Toolbar'

/**
 * Render toolbar above selection.
 */
function HoverToolbar(): Plugin {
  return {
    render: (props: any, state, editor) =>
      <span>
        {props.children}
        <Toolbar key="toolbar" state={state} onChange={editor.onChange} />
      </span>
  }
}

export default HoverToolbar
