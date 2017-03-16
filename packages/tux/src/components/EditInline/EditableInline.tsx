import React from 'react'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export interface EditableInlineProps {
  save: (model: any) => void,
  load: (model: any) => any,
  children?: any,
  field: string | Array<string>,
}

export interface EditableInlineState {
  editorState: any,
}

class EditableInline extends React.Component<EditableInlineProps, EditableInlineState> {
  static contextTypes = {
    model: React.PropTypes.object.isRequired,
    readOnly: React.PropTypes.bool,
  }

  state: EditableInlineState = {
    editorState: editorStateFromRaw(get(this.context.model, this.props.field)),
  }

  onEditorChange = (editorState: EditorState) => {
    this.setState({ editorState })
  }

  getCustomSidebar() {
    return null
  }

  render() {
    const { editorState } = this.state
    const { save, load, children, field, ...props } = this.props
    const contentFromAdapter = editorState.getCurrentContent().hasText()

    return (
      <div {...props}>
        {contentFromAdapter
          ? (
            <MegadraftEditor
              editorState={editorState}
              onChange={this.onEditorChange}
              sidebarRendererFn={this.getCustomSidebar}
              readOnly={this.context.readOnly}
            />
          )
          : (
            children
          )
        }
      </div>
    )
  }
}

export default EditableInline
