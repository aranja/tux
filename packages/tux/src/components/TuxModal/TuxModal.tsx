import React from 'react'

import { tuxColors, tuxInputStyles, tuxButtonStyles } from '../../styles'
import { fade } from '../../utils/color'
import moment from 'moment'
import MarkdownField from '../fields/MarkdownField'
import TextField from '../fields/TextField'
import DatePicker from '../fields/DatePicker'
import TuxSpinner from '../Spinner/Spinner'
import ImageField from '../fields/ImageField'
import TagEditor from '../fields/TagEditor'
import Radio from '../fields/Radio'
import Boolean from '../fields/Boolean'
import Dropdown from '../fields/Dropdown'

export interface State {
  fullModel: any | null
  typeMeta: any | null
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

  onChange(value: any, type: {id: string}) {
    const { fullModel } = this.state
    const field = fullModel.fields[type.id]

    field['en-US'] = value

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
    const field = fullModel.fields[type.id]
    const value = field && field['en-US']
    const widgetId = type.control.widgetId

    if (widgetId === 'boolean') {
      return (
        <div key={type.id}>
          <Boolean
            id={type.id}
            boolLabels={Object.values(type.control.settings)}
            value={value}
            label={type.name}
            helpText={helpText}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }

    else if (widgetId === 'markdown') {
      return (
        <div key={type.id}>
          <MarkdownField
            id={type.id}
            value={value}
            label={type.name}
            helpText={helpText}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }

    else if (widgetId === 'datePicker') {
      return (
        <div key={type.id}>
          <DatePicker
            id={type.id}
            value={value}
            label={type.name}
            helpText={helpText}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }

    else if (widgetId === 'assetLinkEditor') {
      return (
        <div key={type.id}>
          <ImageField
            id={type.id}
            value={value}
            label={type.name}
            helpText={helpText}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }

    else if (widgetId === 'radio') {
      return (
        <div key={type.id}>
          <Radio
            id={type.id}
            value={value}
            label={type.name}
            helpText={helpText}
            choices={type.validations[0].in}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }

    else if (widgetId === 'dropdown') {
      return (
        <div key={type.id}>
          <Dropdown
            dropdownValues={type.validations[0].in}
            id={type.id}
            value={value}
            label={type.name}
            helpText={helpText}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }

    else {
      return (
        <div key={type.id}>
          <TextField
            id={type.id}
            value={value}
            label={type.name}
            helpText={helpText}
            onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
          />
        </div>
      )
    }
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
              <div className="TuxModal-meta">
              { fullModel.sys.updatedAt && (
                <p className="TuxModal-metaLastUpdated">
                Last updated {moment(new Date(fullModel.sys.updatedAt)).fromNow()}
                </p>
              ) }
              </div>
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
            height: 100vh;
            overflow: auto;
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
            padding: 30px;
          }

          .TuxModal-meta {
            font-size: 16px;
            margin-bottom: 20px;
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
            transition: background 0.25s, color 0.25s, border-color 0.25s;
            vertical-align: baseline;
          }

          .TuxModal-button + .TuxModal-button {
            margin-left: 16px;
          }

          .TuxModal-button.TuxModal-button--green {
            color: ${tuxButtonStyles.greenTheme.textColor};
            background: ${tuxButtonStyles.greenTheme.backgroundColor};
            border-color: ${tuxButtonStyles.greenTheme.borderColor};
          }
        `}</style>
      </div>
    )
  }
}

export default TuxModal
