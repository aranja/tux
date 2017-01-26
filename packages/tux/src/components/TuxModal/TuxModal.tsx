import * as React from 'react'
import MaterialTextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

interface Field {
  id : string
  value : string
  label : string
  helpText : string
  onChange : (e : React.FormEvent<any>) => void
}

interface FieldComponent {
  id : string
  type : string
  control : {
    widgetId : string
  }
}

interface State {
  fullModel : any | null
  typeMeta : any | null
}

const MarkdownField = ({id, value, label, helpText, onChange} : Field) => (
  <MaterialTextField multiLine={true} rows={3} hintText={helpText} floatingLabelText={label} id={id} value={value}
                     onChange={onChange}/>
)

const TextField = ({id, value, label, helpText, onChange} : Field) => (
  <MaterialTextField hintText={helpText} floatingLabelText={label} id={id} value={value} onChange={onChange}/>
)

function componentForField({id, type, control: {widgetId}} : FieldComponent) {
  if (type === 'Array')
    return null
  if (widgetId === 'markdown') {
    return MarkdownField
  } else {
    return TextField
  }
}

class TuxModal extends React.Component<any, State> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state : State = {
    fullModel: null,
    typeMeta: null,
  }

  async componentDidMount() {
    const {model} = this.props

    const [
      fullModel,
      typeMeta,
    ] = await Promise.all([
      this.context.tux.adapter.load(model),
      this.context.tux.adapter.getSchema(model),
    ])

    this.setState({
      fullModel,
      typeMeta,
    })
  }

  onChange(event : React.ChangeEvent<any>, type : {id : string}) {
    const {fullModel} = this.state
    const field = fullModel.fields[type.id]
    field['en-US'] = event.target.value
    this.setState({fullModel})
  }

  onCancel = () => {
    this.props.onClose()
  }

  onSubmit = async(event : React.FormEvent<any>) => {
    event.preventDefault()

    const {fullModel} = this.state
    await this.context.tux.adapter.save(fullModel)
    this.props.onClose(true)
  }

  renderField = (type : any) => {
    const helpText = type.control.settings && type.control.settings.helpText
    const InputComponent = componentForField(type)
    const field = this.state.fullModel.fields[type.id]
    const value = field && field['en-US']

    if (!InputComponent) {
      return null
    }
    return (
      <div key={type.id}>
        <InputComponent id={type.id} value={value} label={type.name} helpText={helpText}
                        onChange={event => this.onChange(event, type)}/>
      </div>
    )
  }

  render() {
    const {fullModel, typeMeta} = this.state
    return (
      <div className="TuxModal">
        {fullModel ? (
            <form onSubmit={this.onSubmit}>
              <h1 className="TuxModal-title">{`Edit ${typeMeta.name.toLowerCase()}`}</h1>
              {typeMeta.fields.map(this.renderField)}
              <div className="TuxModal-buttons">
                <FlatButton label="Cancel" onClick={this.onCancel}/>
                <RaisedButton className="TuxModal-saveBtn" type="submit" primary={true} label="Save"/>
              </div>
            </form>
          ) : (
            'Loading'
          )}
      </div>
    )
  }
}

export default TuxModal
