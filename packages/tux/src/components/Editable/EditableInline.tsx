import React from 'react'
import classNames from 'classnames'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export interface EditableInlineProps {
  model: any,
  field: string | Array<string>,
  onChange?: () => void,
  shouldDisplayClues: boolean,
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
    const { children, field, model, onChange, shouldDisplayClues } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing

    return (
      <div className={classNames(shouldDisplayClues && 'display-editable-clue')}>
        <MegadraftEditor
        editorState={this.state.editorState}
        onChange={this.onEditorChange.bind(this)}
        sidebarRendererFn={this.getCustomSidebar}/>
        <style jsx>{`
          .display-editable-clue {
            animation: editableClue 1s;
          }
          @keyframes editableClue {
            from {
              background: rgba(232, 0, 138, 0.2);
            }
            to {
              background: rgba(232, 0, 138, 0);
            }
          }
        `}</style>
      </div>
    )
  }
}

export default EditableInline
