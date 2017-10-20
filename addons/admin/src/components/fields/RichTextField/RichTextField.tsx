import React, { ReactNode } from 'react'
import { State as EditorState, Plugin } from 'slate'
import { renderToStaticMarkup } from 'react-dom/server'
import { Theme, input } from '../../../theme'
import SlateRenderer from '../../../slate/SlateRenderer'
import { deserialize, serialize, Format } from '../../../slate/serializers'
import { HtmlPaste, MarkShortcuts } from '../../../slate/plugins'
import {
  hasBlock,
  hasMark,
  toggleBlock,
  toggleMark,
} from '../../../slate/UiUtils'

// icons
import FaBold from 'react-icons/lib/fa/bold'
import FaItalic from 'react-icons/lib/fa/italic'
import FaUnderline from 'react-icons/lib/fa/underline'
import FaQuoteRight from 'react-icons/lib/fa/quote-right'
import FaListUl from 'react-icons/lib/fa/list-ul'
import FaListOl from 'react-icons/lib/fa/list-ol'
import ToolbarButton from './ToolbarButton'

export interface Props {
  field: string | Array<string>
  format: Format
  id: string
  onChange: (state: any) => void
  placeholder: string
  plugins: Plugin[]
  value: any
}

export interface State {
  editorState: EditorState
  plugins: Plugin[]
}

class RichTextField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editorState: this.getInitialEditorState(),
      plugins: props.plugins || this.getDefaultPlugins(),
    }
  }

  getInitialEditorState() {
    const { value, format } = this.props
    let state: EditorState | null = null

    try {
      state = deserialize(value, format)
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error('Could not parse editor state', value, err)
    }

    return state || (deserialize('', 'plain') as EditorState)
  }

  getDefaultPlugins() {
    if (this.props.format === 'plain') {
      return []
    }
    return [HtmlPaste(), MarkShortcuts()]
  }

  onChange = async (editorState: EditorState) => {
    const { format, onChange } = this.props

    this.setState({ editorState })
    onChange(serialize(editorState, format))
  }

  onClickMark = (type: string) => {
    const { editorState } = this.state
    this.onChange(toggleMark(editorState, type))
  }

  onClickBlock = (type: string) => {
    const { editorState } = this.state
    this.onChange(toggleBlock(editorState, type))
  }

  renderBlockButton(type: string, icon: ReactNode) {
    const { editorState } = this.state
    const isActive = hasBlock(editorState, type)

    return (
      <ToolbarButton
        onClick={this.onClickBlock}
        icon={icon}
        isActive={isActive}
        type={type}
      />
    )
  }

  renderMarkButton(type: string, icon: ReactNode) {
    const { editorState } = this.state
    const isActive = hasMark(editorState, type)

    return (
      <ToolbarButton
        onClick={this.onClickMark}
        icon={icon}
        isActive={isActive}
        type={type}
      />
    )
  }

  render() {
    const { placeholder } = this.props
    const { editorState, plugins } = this.state
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
            onChange={this.onChange}
            placeholder={placeholder || ''}
            plugins={plugins}
            state={editorState}
            style={{ width: '100%' }}
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

export default RichTextField
