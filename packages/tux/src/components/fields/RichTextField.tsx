import React from 'react'
import { Raw, Plain } from 'slate'
import deepEqual from 'deep-eql'
import { renderToStaticMarkup } from 'react-dom/server'
import { Theme, input, button } from '../../theme'
import SlateRenderer from '../EditInline/SlateRenderer'
import { get, set } from '../../utils/accessors'
import { Html } from '../../utils/slate'
import { EditableProps } from '../../interfaces'
import { createEditable } from '../Editable/Editable'
import withEditorState from '../HOC/withEditorState'

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
  editorState: any
}

class RichTextField extends React.Component<Props> {
  static getInitialEditorState(props) {
    const { value } = props

    try {
      if (value) {
        return Raw.deserialize(value, { terse: true })
      } else if (props.children) {
        const html = renderToStaticMarkup(props.children)
        return Html.deserialize(html)
      }
    } catch (err) {
      console.error('Could not parse content', value, err)
    }
    return Plain.deserialize('')
  }

  componentDidUpdate(oldProps) {
    if (oldProps.editorState !== this.props.editorState) {
      this.onChange()
    }
  }

  onChange = async () => {
    const { onEditorChange, editorState } = this.props
    onEditorChange(editorState)
  }


  renderBlockButton(type, icon) {
    const { onClickBlock, hasBlock } = this.props
    const isActive = hasBlock(type)
    const onMouseDown = event => onClickBlock(event, type)

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

  renderMarkButton(type, icon) {
    const { onClickMark, hasMark } = this.props
    const isActive = hasMark(type)
    const onMouseDown = event => onClickMark(event, type)

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

  render() {
    const { editorState, onEditorChange, value, isEditing, placeholder, onKeyDown } = this.props
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
          {this.renderBlockButton('bulleted-list', <FaListUl />)}
          {this.renderBlockButton('numbered-list', <FaListOl />)}
        </div>
        <div className="RichTextField-editor">
          <SlateRenderer
            style={{ width: '100%' }}
            state={editorState}
            onChange={onEditorChange}
            onKeyDown={onKeyDown}
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
            display: flex;
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

export default withEditorState(RichTextField, RichTextField.getInitialEditorState)
