import React from 'react'
import { createEditable } from '../Editable/Editable'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON, EditorState } from 'megadraft'
import { get, set } from '../../utils/accessors'

export interface Props {
  save: (model: any) => void,
  load: (model: any) => any,
  children?: any,
  field: string | Array<string>,
  model: any,
  readOnly: boolean,
}

export interface State {
  editorState: any,
}

class EditInline extends React.Component<Props, State> {
  state: State = {
    editorState: editorStateFromRaw(get(this.props.model, this.props.field)),
  }

  onEditorChange = (editorState: EditorState) => {
    this.setState({ editorState })
  }

  getCustomSidebar() {
    return null
  }

  render() {
    const { children } = this.props
    const { editorState } = this.state

    if (editorState.getCurrentContent().hasText()) {
      return (
        <div className="EditInline">
          <MegadraftEditor
            editorState={editorState}
            onChange={this.onEditorChange}
            sidebarRendererFn={this.getCustomSidebar}
            readOnly={this.context.readOnly}
          />
          <style jsx>{`
          .EditInline:hover {
            cursor: text;
            outline: 1px dashed rgba(128, 128, 128, 0.7);
          }
        `}</style>
        </div>
      )
    }

    return children || null
  }
}

export default createEditable<Props>()(EditInline)
