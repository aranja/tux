import React from 'react'
import { tuxColors, tuxInputStyles, tuxButtonStyles } from '../../styles'
import { fade } from '../../utils/color'
import { timeSince } from '../../utils/time'
import MarkdownField from '../fields/MarkdownField'
import TextField from '../fields/TextField'
import DatePicker from '../fields/DatePicker'
import TuxSpinner from '../Spinner/Spinner'


interface Field {
  id: string
  value: string
  label: string
  helpText: string
  onChange: (e: React.FormEvent<any>) => void
}

interface FieldComponent {
  id: string
  type: string
  control: {
    widgetId: string
  }
}

export interface State {
  fullModel: any | null
  typeMeta: any | null
}

function componentForField({ id, type, control: { widgetId } }: FieldComponent) {
  if (type === 'Array')
    return null
  if (widgetId === 'markdown') {
    return MarkdownField
  }
  if (widgetId === 'datePicker') {
    return DatePicker
  }
  else {
    return TextField
  }
}

class TuxModal extends React.Component<any, State> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state: State = {
    fullModel: null,
    typeMeta: null,
  }

  async componentDidMount() {
    const { model } = this.props

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

  onChange(event: React.ChangeEvent<any>, type: {id: string}) {
    const { fullModel } = this.state
    const field = fullModel.fields[type.id]
    field['en-US'] = event.target.value
    this.setState({fullModel})
  }

  onCancel = () => {
    this.props.onClose()
  }

  onSubmit = async(event: React.FormEvent<any>) => {
    event.preventDefault()

    const { fullModel } = this.state
    await this.context.tux.adapter.save(fullModel)
    this.props.onClose(true)
  }

  renderField = (type: any) => {
    const { fullModel } = this.state
    const helpText = type.control.settings && type.control.settings.helpText
    const InputComponent = componentForField(type)
    const field = fullModel.fields[type.id]
    const value = field && field['en-US']

    if (!InputComponent) {
      return null
    }
    return (
      <div key={type.id}>
        <InputComponent
          id={type.id}
          value={value}
          label={type.name}
          helpText={helpText}
          onChange={event => this.onChange(event, type)}
        />
      </div>
    )
  }

  render() {
    const { fullModel, typeMeta } = this.state
    return (
      <div className="TuxModal">
        {fullModel ? (
          <form onSubmit={this.onSubmit}>
            <div className="TuxModal-topBar">
              <h1 className="TuxModal-title">
                Editing <strong className="TuxModal-modelName">{typeMeta.name}</strong>
              </h1>
              <div className="TuxModal-buttons">
                <button
                  className="TuxModal-button"
                  label="Cancel"
                  onClick={this.onCancel}>Cancel</button>
                <button
                  className="TuxModal-button TuxModal-button--green"
                  type="submit"
                  label="Save">Update</button>
              </div>
            </div>
            <div className="TuxModal-content">
              {typeMeta.fields.map(this.renderField)}
            </div>
            <div className="TuxModal-meta">
              <p className="TuxModal-metaLastUpdated">
                Last updated {timeSince(new Date(fullModel.sys.updatedAt))} ago
              </p>
            </div>
          </form>
        ) : (
          <TuxSpinner />
        )}
        <style jsx>{`
          .TuxModal {
            background: ${tuxColors.colorSnow};
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            margin: 0;
            margin-left: auto;
            max-width: 800px;
            height: 100%;
            padding: 0;
            position: relative;
            width: 60%;
          }

          .TuxModal-topBar {
            background: ${tuxColors.colorWhite};
            border-bottom: 1px solid rgba(203, 203, 203, 0.53);
            display: flex;
            justify-content: space-between;
            padding: 30px;
          }

          .TuxModal-content {
            padding: 0 30px;
          }

          .TuxModal-meta {
            font-size: 16px;
            text-align: right;
            padding: 0 30px;
          }

          .TuxModal-metaLastUpdated {
            color: ${fade(tuxColors.textGray, 0.5)};
            font-weight: 300;
          }

          .TuxModal-title {
            color: ${tuxColors.textDark};
            font-size: 25px;
            font-weight: 300;
            margin: 0;
          }

          .TuxModal-modelName {
            font-weight: 400;
            text-transform: capitalize;
          }

          .TuxModal-buttons {
            display: flex;
            justify-content: flex-end;
          }

          .TuxModal-button {
            background: ${tuxButtonStyles.backgroundColor};
            border-radius: 2px;
            border: 1px solid ${tuxButtonStyles.borderColor};
            color: ${tuxButtonStyles.textColor};
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.3;
            margin: 0;
            padding: 10px 24px;
            text-align: center;
            vertical-align: baseline;
          }

          .TuxModal-button + .TuxModal-button {
            margin-left: 16px;
          }

          .TuxModal-button.TuxModal-button--green {
            color: #FFF;
            background: ${tuxButtonStyles.greenTheme.backgroundColor};
            border-color: ${tuxButtonStyles.greenTheme.borderColor};
          }
        `}</style>
      </div>
    )
  }
}

export default TuxModal
