import React from 'react'
import { Raw, Plain, State, Html as HtmlSerializer } from 'slate'
import { renderToStaticMarkup } from 'react-dom/server'
import deepEqual from 'deep-eql'
import { Theme, input, button } from '../../theme'
import SlateRenderer from '../EditInline/SlateRenderer'
import { get, set } from '../../utils/accessors'
import { Html } from '../../utils/slate'
import { EditableProps } from '../../interfaces'
import { createEditable } from '../Editable/Editable'

// icons
import FaBold from 'react-icons/lib/fa/bold'
import FaItalic from 'react-icons/lib/fa/italic'
import FaUnderline from 'react-icons/lib/fa/underline'
import FaQuoteRight from 'react-icons/lib/fa/quote-right'
import FaListUl from 'react-icons/lib/fa/list-ul'
import FaListOl from 'react-icons/lib/fa/list-ol'

export interface Props extends EditableProps {
  value: any
  id: string
  placeholder: string
  field: string | Array<string>
  onChange: Function
  isEditing: boolean
}

export interface State {
  editorState: any
}

class RichTextField extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context)

    this.state = {
      editorState: this.getInitialState()
    }
  }

  getInitialState() {
    const { value } = this.props

    try {
      if (value) {
        return Raw.deserialize(value, { terse: true })
      } else if (this.props.children) {
        const html = renderToStaticMarkup(this.props.children)
        return Html.deserialize(html)
      }
    } catch (err) {
      console.error('Could not parse content', value, err)
    }
    return Plain.deserialize('')
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   */
  onKeyDown = (
    event: Event,
    data: { isMod: boolean; key: string },
    state: State
  ) => {
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
    const { onChange, id } = this.props
    this.setState({ editorState })
    const content = Raw.serialize(editorState)
    onChange(content, id)
  }

  hasMark = type => {
    const { editorState } = this.state
    return editorState.marks.some(mark => mark.type === type)
  }

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (
      <span
        className="Toolbar-button"
        onMouseDown={onMouseDown}
        data-active={isActive}
      >
        {icon}
        <style jsx>{`
          .Toolbar-button {
            display: flex;
            margin: 4px;
            margin-left: 12px;
            width: 12px;
            opacity: 0.5;
          }

          .Toolbar-button:first-child {
            margin-left: 6px;
          }

          .Toolbar-button[data-active="true"] {
            opacity: 1;
          }
        `}</style>
      </span>
    )
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    let { editorState } = this.state

    editorState = editorState.transform().toggleMark(type).apply()

    this.setState({ editorState })
  }

  render() {
    const { value, isEditing, placeholder } = this.props
    const { editorState } = this.state
    if (!isEditing && !editorState.document.length) {
      return null
    }
    return (
      <div className="RichTextField">
        <div className="RichTextField-toolbar">
          {this.renderMarkButton('bold', <FaBold />)}
          {this.renderMarkButton('italic', <FaItalic />)}
          {this.renderMarkButton('underlined', <FaUnderline />)}
          {this.renderMarkButton('quote', <FaQuoteRight />)}
          {this.renderMarkButton('bulleted-list', <FaListUl />)}
          {this.renderMarkButton('numbered-list', <FaListOl />)}
        </div>
        <div className="RichTextField-editor">
          <SlateRenderer
            state={editorState}
            onChange={this.onEditorChange}
            onKeyDown={this.onKeyDown}
            placeholder={placeholder || ''}
          />
        </div>
        <style jsx>{`
          .RichTextField {
            align-items: baseline;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
          }
          .RichTextField-toolbar {
            border: 1px solid ${input.border};
            border-bottom: none;
            display: flex;
            padding: 12px;
            width: 100%;
            background: #e5e6ed;
          }
          .RichTextField-editor {
            background: #fff;
            border: 1px solid ${input.border};
            color: ${Theme.textDark};
            font-size: 16px;
            font-weight: 400;
            font-family: initial;
            line-height: 1.5;
            min-height: 12em;
            padding: 8px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default createEditable<Props>()(RichTextField)
