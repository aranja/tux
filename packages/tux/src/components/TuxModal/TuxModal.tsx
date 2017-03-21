import React from 'react'

import { tuxColors, tuxInput, tuxButton } from '../../colors'
import { fade } from '../../utils/color'
import moment from 'moment'
import TuxSpinner from '../Spinner/Spinner'
import Button from '../Button'

import { get, set } from '../../utils/accessors'
import { getEditorSchema, Field } from '../../services/editor'

export interface State {
  fullModel: any | null
  meta: any | null
  editorSchema: Array<Field>
}

class TuxModal extends React.Component<any, State> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state: State = {
    fullModel: null,
    meta: null,
    editorSchema: [],
  }

  async componentDidMount() {
    const { model } = this.props

    const [
      fullModel,
      meta,
    ] = await Promise.all([
      this.context.tux.adapter.load(model),
      this.context.tux.adapter.getMeta(model),
    ])

    this.setState({
      fullModel,
      meta,
      editorSchema: getEditorSchema(meta),
    })
  }

  onChange(value: any, type: string) {
    const { fullModel } = this.state
    set(fullModel, type, value)
    this.setState({ fullModel })
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

  renderField = (field: Field) => {
    const { fullModel } = this.state

    const InputComponent = field.component
    const value = get(fullModel, field.field)

    return InputComponent && (
      <div key={field.field}>
        <label className="TuxModal-inputLabel ">
          {field.label}
        </label>
        <InputComponent
          id={field.field}
          onChange={(value: any) => this.onChange(value, field.field)}
          value={value}
          {...field.props}
        />
        <style jsx>{`
          .TuxModal-inputLabel {
            color: ${tuxInput.labelText};
            display: block;
            font-size: 16px;
            font-weight: 300;
            line-height: 24px;
            padding: 5px 0;
            text-transform: capitalize;
            margin-top: 15px;
          }
        `}</style>
      </div>
    )
  }

  render() {
    const { fullModel, meta, editorSchema } = this.state
    return (
      <div className="TuxModal">
        {fullModel ? (
          <form onSubmit={this.onSubmit}>
            <div className="TuxModal-topBar">
              <h1 className="TuxModal-title">
                Editing <strong className="TuxModal-modelName">{meta.name}</strong>
              </h1>
              <div className="TuxModal-buttons">
                <Button onClick={this.onCancel}>Cancel</Button>
                <Button type="submit" themeColor="green" raised>Update</Button>
              </div>
            </div>
            <div className="TuxModal-content">
              {editorSchema.map(this.renderField)}
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
            background: ${tuxColors.snow};
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
            background: ${tuxColors.white};
            border-bottom: 1px solid rgba(203, 203, 203, 0.53);
            display: flex;
            justify-content: space-between;
            padding: 30px;
          }

          .TuxModal-buttons {
            display: flex;
            justify-content: flex-end;
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
        `}</style>
      </div>
    )
  }
}

export default TuxModal
