import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Raw, Plain } from 'slate'
import humanize from 'string-humanize'
import { Html } from '../../utils/slate'

export default function withEditorState(Component, getInitialEditorState) {
  return class extends React.Component {
    constructor(props: any, context: any) {
      super(props, context)

      this.state = {
        editorState: getInitialEditorState(props)
      }
    }

    hasBlock = type => {
      const { editorState } = this.state
      return editorState.blocks.some(node => node.type === type)
    }

    hasMark = type => {
      const { editorState } = this.state
      return editorState.marks.some(mark => mark.type === type)
    }

    /**
     * Paste handler.
     */
    onPaste = (event, data, state) => {
      if (data.type !== 'html') return
      if (data.isShift) return
      const { document } = Html.deserialize(data.html)
      return state.transform().insertFragment(document).apply()
    }

    /**
     * On key down, if it's a formatting command toggle a mark.
     */
    onKeyDown = (event, data, state) => {
      if (!data.isMod) return
      let mark

      switch (data.key) {
        case 'b':
          mark = 'bold'
          break
        case 'i':
          mark = 'italic'
          break
        case 'u':
          mark = 'underlined'
          break
        default:
          return
      }

      state = state.transform().toggleMark(mark).apply()

      event.preventDefault()
      return state
    }

    onEditorChange = async (editorState: any) => {
      this.setState({ editorState })
    }

    onClickMark = (event, type) => {
      event.preventDefault()
      let { editorState } = this.state
      editorState = editorState.transform().toggleMark(type).apply()

      this.setState({ editorState })
    }

    onClickBlock = (event, type) => {
      event.preventDefault()
      let { editorState } = this.state
      const transform = editorState.transform()
      const { document } = editorState

      // Handle everything but list buttons.
      if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = this.hasBlock(type)
        const isList = this.hasBlock('list-item')

        if (isList) {
          transform
            .setBlock(isActive ? 'paragraph' : type)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else {
          transform.setBlock(isActive ? 'paragraph' : type)
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isList = this.hasBlock('list-item')
        const isType = editorState.blocks.some(block => {
          return !!document.getClosest(
            block.key,
            parent => parent.type === type
          )
        })

        if (isList && isType) {
          transform
            .setBlock('paragraph')
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else if (isList) {
          transform
            .unwrapBlock(
              type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
            )
            .wrapBlock(type)
        } else {
          transform.setBlock('list-item').wrapBlock(type)
        }
      }

      editorState = transform.apply()
      this.setState({ editorState })
    }

    render() {
      const { children, ...rest } = this.props
      const { editorState } = this.state

      return (
        <Component
          editorState={editorState}
          onEditorChange={this.onEditorChange}
          onClickMark={this.onClickMark}
          onClickBlock={this.onClickBlock}
          onKeyDown={this.onKeyDown}
          onPaste={this.onPaste}
          hasBlock={this.hasBlock}
          hasMark={this.hasMark}
          {...rest}
        >
          {children}
        </Component>
      )
    }
  }
}
