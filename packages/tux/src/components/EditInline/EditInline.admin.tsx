import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { renderToStaticMarkup } from 'react-dom/server'
import deepEqual from 'deep-eql'
import humanize from 'string-humanize'
import SlateRenderer from '../../slate/SlateRenderer'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'
import { State as EditorState, Plugin } from 'slate'
import { get, set } from '../../utils/accessors'
import { serialize, deserialize, Format } from '../../slate/serializers'
import { HoverToolbar, HtmlPaste, MarkShortcuts } from '../../slate/plugins'

export interface Props extends EditableProps {
  children?: ReactNode
  placeholder?: string
  field: string | Array<string>
  format?: Format
  plugins?: Plugin[]
}

export interface State {
  editorState: EditorState
  plugins: Plugin[]
}

class EditInline extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editorState: this.getInitialEditorState(),
      plugins: props.plugins || this.getDefaultPlugins()
    }
  }

  static propTypes = {
    children: PropTypes.any,
    format: PropTypes.oneOf(['plain', 'html', 'raw']),
    field: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    placeholder: PropTypes.string,
    plugins: PropTypes.array,
  }

  static defaultProps = {
    format: 'plain',
  }

  getInitialEditorState() {
    const { model, field, format, children } = this.props
    const value = get(model, field)
    let state: EditorState | null = null

    try {
      state = deserialize(value, format)
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error('Could not parse editor state', value, err)
    }

    if (!state && children) {
      try {
        if (typeof children === 'string') {
          state = deserialize(children, 'plain')
        } else if (React.isValidElement(children)) {
          const html = renderToStaticMarkup(children)
          state = deserialize(html, 'html')
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error('Could not parse fallback content', value, err)
      }
    }

    if (!state) {
      state = deserialize('', 'plain')
    }
    return state as EditorState
  }

  getDefaultPlugins() {
    if (this.props.format === 'plain') {
      return []
    }
    return [
      HoverToolbar(),
      HtmlPaste(),
      MarkShortcuts(),
    ]
  }

  private timer: number

  defaultPlaceholder() {
    let { field } = this.props
    if (typeof field === 'string') {
      field = field.split('.')
    }
    return humanize(field[field.length - 1])
  }

  private save = async () => {
    const { format, tux, model, field } = this.props
    const { editorState } = this.state
    const oldValue = get(model, field)
    const newValue = serialize(editorState, format)

    // TODO: Properly update props model after saving.
    if (deepEqual(oldValue, newValue)) {
      return
    }

    // TODO: Cache full model somehow.
    const fullModel = await tux.adapter.load(model)
    set(fullModel, field, newValue)
    await tux.adapter.save(fullModel)
  }

  onChange = async (editorState: EditorState) => {
    this.setState({ editorState })

    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  render() {
    const {
      isEditing,
      placeholder,
    } = this.props
    const {
      editorState,
      plugins,
    } = this.state

    if (!isEditing && !editorState.document.length) {
      return null
    }

    return (
      <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
        <SlateRenderer
          state={editorState}
          onChange={this.onChange}
          readOnly={!isEditing}
          placeholder={placeholder || this.defaultPlaceholder()}
          plugins={plugins}
        />
        <style jsx>{`
          .EditInline.is-editing:hover {
            cursor: text;
            outline: 1px dashed rgba(128, 128, 128, 0.7);
            outline-offset: 10px;
          }
        `}</style>
      </div>
    )
  }
}

export default createEditable<Props>()(EditInline)