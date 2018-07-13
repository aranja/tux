import React, { ReactNode } from 'react'
import { Value, Change } from 'slate'
import { Plugin } from 'slate-react'
import MarkHotkeys from 'slate-mark-hotkeys'
import { Theme, input } from '../../../theme'
import SlateRenderer from '../../../slate/SlateRenderer'
import { deserialize, serialize, Format } from '../../../slate/serializers'
import { HtmlPaste } from '../../../slate/plugins'
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
  value: Value
  plugins: Plugin[]
}

class RichTextField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      value: this.getInitialValue(),
      plugins: props.plugins || this.getDefaultPlugins(),
    }
  }

  getInitialValue() {
    const { value, format } = this.props
    let parsedValue: Value | null = null

    try {
      parsedValue = deserialize(value, format)
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error('Could not parse editor state', value, err)
    }

    return parsedValue || (deserialize('', 'plain') as Value)
  }

  getDefaultPlugins() {
    if (this.props.format === 'plain') {
      return []
    }
    return [HtmlPaste(), MarkHotkeys()]
  }

  onChange = async ({ value }: Change) => {
    this.updateValue(value)
  }

  onClickMark = (type: string) => {
    const { value } = this.state
    this.updateValue(toggleMark(value, type))
  }

  onClickBlock = (type: string) => {
    const { value } = this.state
    this.updateValue(toggleBlock(value, type))
  }

  updateValue(value: Value) {
    const { format, onChange } = this.props

    this.setState({ value })
    onChange(serialize(value, format))
  }

  renderBlockButton(type: string, icon: ReactNode) {
    const { value } = this.state
    const isActive = hasBlock(value, type)

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
    const { value } = this.state
    const isActive = hasMark(value, type)

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
    const { value, plugins } = this.state
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
            value={value}
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
