import React from 'react'
import classNames from 'classnames'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export interface EditableInlineProps {
  model: any,
  field: string | Array<string>,
  onChange?: () => void,
  isLoggedIn: boolean,
}

export interface EditableInlineState {
  editorState: any,
}

class EditableInline extends React.Component<EditableInlineProps, EditableInlineState> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state: EditableInlineState = {
    editorState: editorStateFromRaw(null)
  }

  timer: number

  constructor(props: EditableInlineProps) {
    super(props)

    const { model, field } = props
    const content = get(model, field)

    if (content) {
      this.state = {
        editorState: editorStateFromRaw(content)
      }
    }

    this.saveChanges = this.saveChanges.bind(this)
  }

  async saveChanges() {
    const { model, field } = this.props
    const { editorState } = this.state

    let fullModel = await this.context.tux.adapter.load(model)
    const editorStateObj = JSON.parse(editorStateToJSON(editorState))
    set(fullModel, field, editorStateObj)

    this.context.tux.adapter.save(fullModel)
  }

  onEditorChange(editorState: EditorState) {
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
    const { children, field, model, onChange, isLoggedIn } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing
    const classes = classNames(
      'EditableInline',
      isEditing && 'is-editing',
    )

    return (
      <div className={classes}>
        <MegadraftEditor
          readOnly={!isEditing}
          editorState={this.state.editorState}
          onChange={this.onEditorChange.bind(this)}
          sidebarRendererFn={this.getCustomSidebar}
        />
        <style jsx>{`
          .EditableInline.is-editing:hover {
            cursor: text;
            outline: 1px dashed rgba(128, 128, 128, 0.7);
            outline-offset: 10px;
          }
        `}
        </style>
      </div>
    )
  }
}

export default EditableInline
