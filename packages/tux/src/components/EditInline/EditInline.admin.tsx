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
import withEditorState from '../HOC/withEditorState'

export interface Props extends EditableProps {
  onSave: (model: any) => Promise<any>,
  onLoad: (model: any) => void,
  placeholder: string,
  field: string | Array<string>,
  editorState: any,
  onPaste: Function,
  onClickMark: Function,
  onClickNode: Function,
  onEditorChange: Function,
  onKeyDown: Function,
}

class EditInline extends React.Component<Props> {
  static getInitialState(props) {
    const value = get(props.model, props.field)
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

  private timer: number

  componentDidUpdate(oldProps) {
    if (oldProps.editorState !== this.props.editorState) {
      this.save()
    }
  }

  defaultPlaceholder() {
    let { field } = this.props
    if (typeof field === 'string') {
      field = field.split('.')
    }
    return humanize(field[field.length - 1])
  }

  private save = async () => {
    const { editorState, tux, model, field } = this.props
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

  onChange = async (editorState: any) => {
    const { onEditorChange } = this.props
    onEditorChange(editorState)

    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  render() {
    const { editorState, onPaste, onKeyDown, onClickMark, isEditing, placeholder } = this.props

    if (!isEditing && !editorState.document.length) {
      return null
    }

    return (
      <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
        <HoverPortal editorState={editorState} onClickMark={onClickMark} />
        <SlateRenderer
          state={editorState}
          onChange={this.onChange}
          readOnly={!isEditing}
          placeholder={placeholder || this.defaultPlaceholder()}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
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

const Exported = withEditorState(EditInline, EditInline.getInitialState)
export default createEditable<Props>()(Exported)