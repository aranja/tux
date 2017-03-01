import React from 'react'
import { tuxColors } from '../../styles'
import { fade } from '../../utils/color'
import { timeSince } from '../../utils/time'
import { InputStyles, buttonStyles } from './styles'

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

const TuxModalSpinner = () => (
  <div className="Spinner">
    <style jsx>{`
      .Spinner {
        animation: pulse 0.75s infinite;
        animation-delay: 0.25s;
        background: ${fade(tuxColors.colorPurple, 0.2)};
        height: 36px;
        margin: auto;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        width: 8px;
      }
      .Spinner::before,
      .Spinner::after {
        animation: pulse 0.75s infinite;
        background: ${fade(tuxColors.colorPurple, 0.2)};
        content: '';
        display: block;
        height: 24px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
      }
      .Spinner::before {
        left: -16px;
      }
      .Spinner::after {
        left: 16px;
        animation-delay: 0.5s;
      }

      @keyframes pulse {
        50% {
          background: ${fade(tuxColors.colorPurple, 0.7)};
        }
      }
    `}</style>
  </div>
)

const TextField = ({ id, value, label, helpText, onChange }: Field) => (
  <div className="Input">
    <label className="InputLabel">{label}:</label>
    <input className="InputField" label={label} id={id} value={value} onChange={onChange}/>
    <style jsx>{`
      .Input {
        display: flex;
        border-radius: 3px;
        align-items: center;
        background: ${tuxColors.colorWhite};
        border: 1px solid ${InputStyles.borderColor};
        margin: 20px 0;
      }
      .InputLabel {
        color: ${InputStyles.labelTextColor};
        font-size: 16px;
        font-weight: 300;
        line-height: 24px;
        margin: 0 8px;
        text-transform: capitalize;
      }
      .InputField {
        background: none;
        border: none;
        color: ${tuxColors.textDark};
        font-size: 16px;
        padding: 0;
        line-height: 36px;
        width: 100%;
      }
      `}</style>
    </div>
  )

  const MarkdownField = ({ id, value, label, helpText, onChange }: Field) => (
    <div className="MarkdownField">
      <label className="MarkdownField-label">{label}:</label>
      <textarea rows="12" className="MarkdownField-textArea" label={label} id={id} value={value} onChange={onChange}/>
      <style jsx>{`
        .MarkdownField {
          align-items: baseline;
          background: ${tuxColors.colorWhite};
          border-radius: 3px;
          border: 1px solid ${InputStyles.borderColor};
          display: flex;
          flex-direction: column;
          margin: 20px 0;
        }

        .MarkdownField-textArea {
          background: none;
          border: none;
          color: ${tuxColors.textDark};
          font-size: 16px;
          width: 100%;
        }

        .MarkdownField-label {
          color: ${InputStyles.labelTextColor};
          font-size: 16px;
          font-weight: 300;
          line-height: 36px;
          margin: 0 8px;
          text-transform: capitalize;
        }
      `}</style>
      </div>
    )

function componentForField({ id, type, control: { widgetId } }: FieldComponent) {
  if (type === 'Array')
    return null
  if (widgetId === 'markdown') {
    return MarkdownField
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
        <InputComponent id={type.id} value={value} label={type.name} helpText={helpText}
                        onChange={event => this.onChange(event, type)}/>
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
              <h1 className="TuxModal-title">Editing <strong className="TuxModal-modelName">{typeMeta.name}</strong></h1>
              <div className="TuxModal-buttons">
                <button className="TuxModal-button" label="Cancel" onClick={this.onCancel}>Cancel</button>
                <button className="TuxModal-button TuxModal-button--green" type="submit" label="Save">Update</button>
              </div>
            </div>
            <div className="TuxModal-content">
              {typeMeta.fields.map(this.renderField)}
            </div>
            <div className="TuxModal-meta">
              <p className="TuxModal-metaLastUpdated">Last updated {timeSince(new Date(fullModel.sys.updatedAt))} ago</p>
            </div>
          </form>
        ) : (
          <TuxModalSpinner />
        )}
        <style jsx>{`
          .TuxModal {
            background: #F3F5F7;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            margin-left: auto;
            max-width: 800px;
            height: 100%;
            padding: 30px;
            position: relative;
            width: 60%;
          }

          .TuxModal-topBar {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
          }

          .TuxModal-meta {
            text-align: right;
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
            background: ${buttonStyles.backgroundColor};
            border-radius: 2px;
            border: 1px solid ${buttonStyles.borderColor};
            color: ${buttonStyles.textColor};
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
            margin-left: 10px;
          }

          .TuxModal-button.TuxModal-button--green {
            color: #FFF;
            background: ${buttonStyles.greenTheme.backgroundColor};
            border-color: ${buttonStyles.greenTheme.borderColor};
          }
        `}</style>
      </div>
    )
  }
}

export default TuxModal
