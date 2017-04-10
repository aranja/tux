import React from 'react'
import DraftRenderer from './DraftRenderer'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../../interfaces'
import { editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export type Props = EditableProps & {
  onSave: (model: any) => Promise<any>,
  onLoad: (model: any) => void,
  placeholder: string,
  field: string | Array<string>,
}

export interface State {
  editorState: any,
}

class EditInline extends React.Component<Props, State> {
  state: State = {
    editorState: editorStateFromRaw(get(this.props.model, this.props.field)),
  }

  private timer: number

  private save = async () => {
    const { tux, model, field } = this.props
    const { editorState } = this.state

    const fullModel = await tux.adapter.load(model)
    const editorStateObj = JSON.parse(editorStateToJSON(editorState))
    set(fullModel, field, editorStateObj)

    await tux.adapter.save(fullModel)
  }

  onEditorChange = async (editorState: EditorState) => {
    this.setState({ editorState })
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  render() {
    return (
      <div className={`EditInline${this.props.isEditing ? ' is-editing' : ''}`}>
        <DraftRenderer
          editorState={this.state.editorState}
          onChange={this.onEditorChange}
          readOnly={this.context.readOnly}
          children={this.props.children}
          placeholder={this.props.placeholder}
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
