import React from 'react'
import { Raw, Plain, State, Html as HtmlSerializer } from 'slate'
import { renderToStaticMarkup } from 'react-dom/server'
import { Theme, input, button } from '../../theme'
import SlateRenderer from '../EditInline/SlateRenderer'
import { get, set } from '../../utils/accessors'
import { Html } from '../../utils/slate'
import { EditableProps } from '../../interfaces'

export interface Props extends EditableProps {
  value: string,
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

  onEditorChange = async (editorState: any) => {
    this.setState({ editorState })
  }

  render() {
    const { id, value, onChange } = this.props
    const { editorState } = this.state

    return (
      <div className="RichTextField">
        <div className="RichTextField-toolbar">
          Toolbar here
        </div>
        <div className="RichTextField-editor">
          <SlateRenderer state={editorState} onChange={this.onEditorChange} />
        </div>
        <style jsx>{`
          .RichTextField {
            align-items: baseline;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
          }

          .RichTextField-editor {
            background: #fff;
            border: 1px solid ${input.border};
            color: ${Theme.textDark};
            font-size: 16px;
            font-weight: 400;
            font-family: initial;
            line-height: 1.5;
            padding: 8px;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default RichTextField
