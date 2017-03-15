import React from 'react'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export interface EditableInlineProps {
  model: any,
  field: string | Array<string>,
  onChange?: () => void,
}

export interface EditableInlineState {
  editorState: any,
}

class EditableInline extends React.Component<EditableInlineProps, EditableInlineState> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state: EditableInlineState = {
    editorState: editorStateFromRaw(get(this.props.model, this.props.field))
  }

  timer: number

  saveChanges = async () => {
    const { model, field } = this.props
    const { editorState } = this.state

    let fullModel = await this.context.tux.adapter.load(model)
    const editorStateObj = JSON.parse(editorStateToJSON(editorState))
    set(fullModel, field, editorStateObj)

    this.context.tux.adapter.save(fullModel)
  }

  onEditorChange = (editorState: EditorState) => {
    this.setState({ editorState })
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(this.saveChanges, 2000)
  }

  getCustomSidebar() {
    return null
  }

  render() {
    return (
      <MegadraftEditor
        editorState={this.state.editorState}
        onChange={this.onEditorChange}
        sidebarRendererFn={this.getCustomSidebar}
      />
    )
  }
}

export default EditableInline
