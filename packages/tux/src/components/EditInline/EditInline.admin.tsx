import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import deepEqual from 'deep-eql'
import humanize from 'string-humanize'
import SlateRenderer from './SlateRenderer'
import HoverPortal from './HoverPortal'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'
import { Raw, Plain, State, Html as HtmlSerializer } from 'slate'
import { Html } from '../../utils/slate'
import { get, set } from '../../utils/accessors'

export interface Props extends EditableProps {
  onSave: (model: any) => Promise<any>,
  onLoad: (model: any) => void,
  placeholder: string,
  field: string | Array<string>,
}

export interface State {
  editorState: any,
}

class EditInline extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context)

    this.state = {
      editorState: this.getInitialState(),
    }

  }

  getInitialState() {
    const value = get(this.props.model, this.props.field)
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

  private timer: number

  defaultPlaceholder() {
    let { field } = this.props
    if (typeof field === 'string') {
      field = field.split('.')
    }
    return humanize(field[field.length - 1])
  }

  private save = async () => {
    const { tux, model, field } = this.props
    const { editorState } = this.state
    const oldValue = get(model, field)
    const newValue = Raw.serialize(editorState, { terse: true })

    // TODO: Properly update props model after saving.
    if (deepEqual(oldValue, newValue)) {
      return
    }

    // TODO: Cache full model somehow.
    const fullModel = await tux.adapter.load(model)
    set(fullModel, field, newValue)
    await tux.adapter.save(fullModel)
  }

  onEditorChange = async (editorState: any) => {
    this.setState({ editorState })
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  /**
   * Paste handler.
   */
  onPaste = (e, data, state) => {
    if (data.type !== 'html') return
    if (data.isShift) return
    const { document } = Html.deserialize(data.html)
    return state
      .transform()
      .insertFragment(document)
      .apply()
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   */
  onKeyDown = (e, data, state) => {
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
      case '`':
        mark = 'code'
        break
      default:
        return
    }

    state = state
      .transform()
      .toggleMark(mark)
      .apply()

    e.preventDefault()
    return state
  }

  /**
   * Click handler for HoverPortal
   */
  onClickMark = (e, type) => {
    e.preventDefault()
    let { editorState } = this.state

    editorState = editorState.transform().toggleMark(type).apply()

    this.setState({ editorState })
  }

  render() {
    const { isEditing, placeholder } = this.props
    const { editorState } = this.state
    if (!isEditing && !editorState.document.length) {
      return null
    }

    return (
      <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
        <HoverPortal editorState={editorState} onClickMark={this.onClickMark} />
        <SlateRenderer
          state={editorState}
          onChange={this.onEditorChange}
          readOnly={!isEditing}
          placeholder={placeholder || this.defaultPlaceholder()}
          onKeyDown={this.onKeyDown}
          onPaste={this.onPaste}
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
