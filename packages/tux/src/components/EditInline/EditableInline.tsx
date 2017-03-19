import React from 'react'
import { createEditable } from '../Editable/Editable'
import { EditableProps } from '../Editable'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export type Props = EditableProps & {
  onSave: (model: any) => Promise<any>,
  onLoad: (model: any) => void,
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
    const { onLoad, onSave, model, field } = this.props
    const { editorState } = this.state

    const fullModel = await onLoad(model)
    const editorStateObj = JSON.parse(editorStateToJSON(editorState))
    set(fullModel, field, editorStateObj)

    onSave(fullModel)
  }

  onEditorChange = async (editorState: EditorState) => {
    this.setState({ editorState })
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.save, 2000)
  }

  static getCustomSidebar() {
    return null
  }

  render() {
    const { children, isEditing } = this.props
    const { editorState } = this.state

    if (editorState.getCurrentContent().hasText()) {
      return (
        <div className={`EditInline${isEditing ? ' is-editing' : ''}`}>
          <MegadraftEditor
            editorState={editorState}
            onChange={this.onEditorChange}
            sidebarRendererFn={EditInline.getCustomSidebar}
            readOnly={this.context.readOnly}
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

    return <span>{children}</span>
  }
}

export default createEditable<Props>()(EditInline)
