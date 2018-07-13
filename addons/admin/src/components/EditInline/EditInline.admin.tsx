import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'

import { renderToStaticMarkup } from 'react-dom/server'
import deepEqual from 'deep-eql'
import humanize from 'string-humanize'
import SlateRenderer from '../../slate/SlateRenderer'
import { createEditable } from '../Editable'
import { EditableProps } from '../../interfaces'
import { Value, Change } from 'slate'
import { Plugin } from 'slate-react'
import MarkHotkeys from 'slate-mark-hotkeys'
import { get, set } from '../../utils/accessors'
import { serialize, deserialize, Format } from '../../slate/serializers'
import { HoverToolbar, HtmlPaste } from '../../slate/plugins'

export interface Props extends EditableProps {
  children?: ReactNode
  placeholder?: string
  field: string | Array<string>
  format?: Format
  plugins?: Plugin[]
}

export interface State {
  value: Value
  plugins: Plugin[]
}

class EditInline extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      value: this.getInitialValue(),
      plugins: props.plugins || this.getDefaultPlugins(),
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

  getInitialValue() {
    const { model, field, format, children } = this.props
    const value = get(model, field)
    let parsedValue: Value | null = null

    try {
      parsedValue = deserialize(value, format)
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error('Could not parse editor state', value, err)
    }

    if (!parsedValue && children) {
      try {
        if (typeof children === 'string') {
          parsedValue = deserialize(children, 'plain')
        } else if (React.isValidElement(children)) {
          const html = renderToStaticMarkup(children)
          parsedValue = deserialize(html, 'html')
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error('Could not parse fallback content', value, err)
      }
    }

    if (!parsedValue) {
      parsedValue = deserialize('', 'plain')
    }
    return parsedValue as Value
  }

  getDefaultPlugins() {
    if (this.props.format === 'plain') {
      return []
    }
    return [HoverToolbar(), HtmlPaste(), MarkHotkeys()]
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
    const { value } = this.state
    const oldValue = get(model, field)
    const newValue = serialize(value, format)

    // TODO: Properly update props model after saving.
    if (deepEqual(oldValue, newValue)) {
      return
    }

    // TODO: Cache full model somehow.
    const fullModel = await tux.adapter.load(model)
    set(fullModel, field, newValue)
    await tux.adapter.save(fullModel)
  }

  onChange = async ({ value }: Change) => {
    this.setState({ value })

    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  render() {
    const { isEditing, placeholder } = this.props
    const { value, plugins } = this.state

    if (!isEditing && !value.document.size) {
      return null
    }
    console.log(value.document.toJSON())
    return (
      <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
        <SlateRenderer
          value={value}
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
