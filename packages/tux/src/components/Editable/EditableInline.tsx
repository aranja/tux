import React from 'react'
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft'

const getField = (model, field) => {
  if (typeof field === 'string')
    return getField(model, field.split('.'))
  return field.reduce((object, key) => object[key], model)
}

const setField = (model, field, editorState) => {
  if (typeof field === 'string')
    return setField(model, field.split('.'), editorState)

  let localized = field.slice()
  localized.splice(2, 0, 'en-US')

  localized.reduce((object, key, index) => {
    if (index === localized.length - 1) {
      object[key] = JSON.parse(editorStateToJSON(editorState))
    }
    return object[key]
  }, model)
}

export interface EditableInlineProps {
  model : any,
  field : string | Array<string>,
  onChange : Function,
  children : any,
}

export interface EditableInlineState {
  editorState : any,
}

class EditableInline extends React.Component<EditableInlineProps, EditableInlineState> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state : EditableInlineState = {
    editorState: editorStateFromRaw(null)
  }

  timer : number

  constructor(props) {
    super(props)

    const { model, field } = props
    const content = getField(model, field)
    this.state = {
      editorState: editorStateFromRaw(content)
    }

    this.saveChanges = this.saveChanges.bind(this)
  }

  async saveChanges() {
    const { model, field } = this.props
    const { editorState } = this.state

    let fullModel = await this.context.tux.adapter.load(model)
    setField(fullModel, field, editorState)

    this.context.tux.adapter.save(fullModel)
  }

  onEditorChange(editorState) {
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
    const { children, field, model, onChange } = this.props
    const isEditing = this.context.tux && this.context.tux.isEditing

    if (isEditing) {
      return (
        <MegadraftEditor
          editorState={this.state.editorState}
          onChange={this.onEditorChange.bind(this)}
          sidebarRendererFn={this.getCustomSidebar}/>
      )
    }

    return <div>{getField(model, field)}</div>
  }
}

export default EditableInline
