import React, {
  Component,
  ComponentClass,
  SyntheticEvent,
  KeyboardEvent,
  ClipboardEvent,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  State as EditorState,
  KeyDownHandler,
  PasteHandler,
  Block,
} from 'slate'
import { Html } from '../../utils/slate'

export interface EditorStateProps {
  editorState: EditorState
  onEditorChange(state: EditorState): void
  onClickMark(event: SyntheticEvent<any>, type: string): void
  onClickBlock(event: SyntheticEvent<any>, type: string): void
  onKeyDown: KeyDownHandler
  onPaste: PasteHandler
  hasMark(type: string): boolean
  hasBlock(type: string): boolean
}

export interface State {
  editorState: EditorState,
}

export default function withEditorState<InnerProps>(
  Component: ComponentClass<InnerProps | EditorStateProps>,
  getInitialEditorState: (props: InnerProps) => EditorState,
): ComponentClass<InnerProps> {
  return class extends React.Component<InnerProps, State> {
    state: State

    constructor(props: any, context: any) {
      super(props, context)

      this.state = {
        editorState: getInitialEditorState(props)
      }
    }

    hasBlock = (type: string) => {
      const { editorState } = this.state
      return editorState.blocks.some(node => node ? node.type === type : false)
    }

    hasMark = (type: string) => {
      const { editorState } = this.state
      return editorState.marks.some(mark => mark ? mark.type === type : false)
    }

    /**
     * Paste handler.
     */
    onPaste: PasteHandler = (event, data, state) => {
      if (data.type !== 'html') return
      if (data.isShift) return
      if (data.type === 'html') {
        console.log(data.html)
      }
      const { document } = Html.deserialize(data.html)
      return state.transform().insertFragment(document).apply()
    }

    /**
     * On key down, if it's a formatting command toggle a mark.
     */
    onKeyDown: KeyDownHandler = (event, data, state) => {
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

    onEditorChange = async (editorState: EditorState) => {
      this.setState({ editorState })
    }

    onClickMark = (event: SyntheticEvent<any>, type: string) => {
      event.preventDefault()
      let { editorState } = this.state
      editorState = editorState.transform().toggleMark(type).apply()

      this.setState({ editorState })
    }

    onClickBlock = (event: SyntheticEvent<any>, type: string) => {
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
          return block == null ? false : !!document.getClosest(
            block.key,
            parent => (parent as Block).type === type
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
          {...this.props}
        />
      )
    }
  }
}
