import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import DraftRenderer from './DraftRenderer'
import { createEditable } from '../Editable/Editable'
import deepEqual from 'deep-eql'
import humanize from 'string-humanize'
import { EditableProps } from '../../interfaces'
import { DraftJS, editorStateFromRaw, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

interface Props extends EditableProps {
  onSave: (model: any) => Promise<any>,
  onLoad: (model: any) => void,
  placeholder: string,
  field: string | Array<string>,
}

export interface State {
  editorState: any,
}

function wrapChildren(children: any) {
  if (typeof children === 'string') {
    return <span>{children}</span>
  } else if (Array.isArray(children) && children.length > 1) {
    return <div>{children}</div>
  } else {
    return children
  }
}

class EditInline extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context)

    const value = get(props.model, props.field)
    let editorState
    if (!value && props.children) {
      const html = renderToStaticMarkup(wrapChildren(props.children))
      const content = DraftJS.ContentState.createFromBlockArray(DraftJS.convertFromHTML(html))
      editorState = DraftJS.EditorState.createWithContent(content)
    } else {
      editorState = editorStateFromRaw(value)
    }
    this.state = {
      editorState,
    }
  }

  private timer: number

  private save = async () => {
    const { tux, model, field } = this.props
    const { editorState } = this.state
    const oldValue = get(model, field)
    const newValue = DraftJS.convertToRaw(editorState.getCurrentContent())

    // TODO: Properly update props model after saving.
    if (deepEqual(oldValue, newValue)) {
      return
    }

    // TODO: Cache full model somehow.
    const fullModel = await tux.adapter.load(model)
    set(fullModel, field, newValue)
    await tux.adapter.save(fullModel)
  }

  onEditorChange = async (editorState: EditorState) => {
    this.setState({ editorState })
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  defaultPlaceholder() {
    let { field } = this.props
    if (typeof field === 'string') {
      field = field.split('.')
    }
    return humanize(field[field.length - 1])
  }

  render() {
    const { isEditing, placeholder } = this.props
    const { editorState } = this.state
    if (!isEditing && !editorState.getCurrentContent().hasText()) {
      return null
    }

    return (
      <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
        <DraftRenderer
          editorState={editorState}
          onChange={this.onEditorChange}
          readOnly={!isEditing}
          placeholder={placeholder || this.defaultPlaceholder()}
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
