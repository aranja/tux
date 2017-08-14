import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Raw, Plain } from 'slate'
import { Html } from '../../utils/slate'

export default function withEditorState(Component, getInitialEditorState) {
  return class extends React.Component {
    constructor(props: Props, context: any) {
      super(props, context)
      console.log(getInitialEditorState)

      this.state = {
        editorState: getInitialEditorState(props)
      }
    }

    componentDidMount() {
      console.log(this.state)
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

    onEditorChange = async (editorState: any, id) => {
      const { onChange } = this.props
      this.setState({ editorState })
      onChange(Raw.serialize(editorState), id)
    }


    onClickMark = (event, type) => {
      event.preventDefault()
      let { editorState } = this.state

      editorState = editorState.transform().toggleMark(type).apply()

      this.setState({ editorState })
    }

    onClickNode = (event, type) => {
      // Todo
    }

    render() {
      const { children, ...rest } = this.props
      const { editorState } = this.state

      return (
        <Component
          editorState={editorState}
          onEditorChange={this.onEditorChange}
          onClickMark={this.onClickMark}
          onClickNode={this.onClickNode}
          onEditorChange={this.onEditorChange}
          onKeyDown={this.onKeyDown}
          {...rest}
        >
          {children}
        </Component>
      )
    }
  }
}
