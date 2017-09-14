import React, { ReactNode, ReactElement } from 'react'
import PropTypes from 'prop-types'
import { renderToStaticMarkup } from 'react-dom/server'
import deepEqual from 'deep-eql'
import humanize from 'string-humanize'
import SlateRenderer from '../../slate/SlateRenderer'
import { createEditable } from '../Editable'
import { EditableProps } from '../../interfaces'
import { State as EditorState, Plugin } from 'slate'
import { get, set } from '../../utils/accessors'
import { serialize, deserialize, Format } from '../../slate/serializers'
import { HoverToolbar, HtmlPaste, MarkShortcuts } from '../../slate/plugins'

export interface Props extends EditableProps {
  children?: ReactNode
  placeholder?: string
  defaultValue?: string
  field: string | Array<string>
  format?: Format
  plugins?: Plugin[]
  render?: (options: { isEditing: boolean, value: any, renderer: ReactElement<any> }) => Element
  value?: any
}

export interface State {
  editorState: EditorState
  plugins: Plugin[]
  value: any
}

class EditInline extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editorState: this.getInitialEditorState(),
      plugins: props.plugins || this.getDefaultPlugins(),
      value: get(props.model, props.field),
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

  static defaultProps: Partial<Props> = {
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
    this.setState({ value: newValue })
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
      render,
      format,
    } = this.props

    const {
      editorState,
      plugins,
      value,
    } = this.state

    let renderer = (
      <SlateRenderer
        state={editorState}
        onChange={this.onChange}
        readOnly={!isEditing}
        placeholder={placeholder || this.defaultPlaceholder()}
        plugins={plugins}
      />
    )

    if (render && typeof render === 'function') {
      renderer = render({ value, renderer, isEditing })
    }

    return (
      <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
        {renderer}
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