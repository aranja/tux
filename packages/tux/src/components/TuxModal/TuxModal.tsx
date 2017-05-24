import React from 'react'
import PropTypes from 'prop-types'

import { Theme, input, button } from '../../theme'
import { fade } from '../../utils/color'
import moment from 'moment'
import TuxSpinner from '../Spinner/Spinner'
import Button from '../Button'

import { get, set } from '../../utils/accessors'
import { Field } from '../../interfaces'
import { getEditorSchema } from '../../services/editor'

export interface State {
  fullModel: any | null
  meta: any | null
  editorSchema: Array<Field>
}

export interface TuxModalProps {
  model: any,
  onClose?: Function,
  isNew?: any,
}

class TuxModal extends React.Component<TuxModalProps, State> {
  static contextTypes = {
    tux: PropTypes.object,
  }

  state: State = {
    fullModel: null,
    meta: null,
    editorSchema: [],
  }

  async componentDidMount() {
    const { model, isNew } = this.props

    const meta = await this.context.tux.adapter.getMeta(model)
    let fullModel = null

    if (isNew) {
      fullModel = await this.context.tux.adapter.create(meta)
    } else {
      fullModel = await this.context.tux.adapter.load(model)
    }

    this.setState({
      fullModel,
      meta,
      editorSchema: getEditorSchema(meta),
    })
  }

  onChange(value: any, field: string) {
    const { fullModel } = this.state
    set(fullModel, field, value)
    this.setState({ fullModel })
  }

  onCancel = () => {
    const { onClose } = this.props
    if (onClose) {
      onClose()
    }
  }

  onSubmit = async(event: React.FormEvent<any>) => {
    event.preventDefault()

    const { isNew, onClose } = this.props
    const { fullModel, meta } = this.state

    await this.context.tux.adapter.save(fullModel)

    if (onClose) {
      onClose(true)
    }
  }

  renderField = (field: Field) => {
    const { fullModel } = this.state

    const InputComponent = field.component
    const value = get(fullModel, field.field)

    return InputComponent && (
      <div className="InputComponent" key={field.field}>
        <label className="InputComponent-label ">
          {field.label}
        </label>
        <InputComponent
          id={field.field}
          onChange={(value: any) => this.onChange(value, field.field)}
          value={value}
          {...field.props}
        />
        <style jsx>{`
          .InputComponent {
            margin: 16px 0;
          }
          .InputComponent-label {
            color: ${input.labelText};
            display: block;
            font-size: 14px;
            font-weight: 300;
            line-height: 24px;
            padding: 0;
            padding-bottom: 5px;
            text-transform: capitalize;
          }
        `}</style>
      </div>
    )
  }

  render() {
    const { fullModel, meta, editorSchema } = this.state
    const { isNew } = this.props
    const modalHeading = isNew ? 'Creating' : 'Editing'
    const modalAction = isNew ? 'Create' : 'Save'
    return (
      <div className="TuxModal">
        {fullModel ? (
          <form onSubmit={this.onSubmit}>
            <div className="TuxModal-topBar">
              <h1 className="TuxModal-title">
                {modalHeading} <strong className="TuxModal-modelName">{meta.name}</strong>
              </h1>
              <div className="TuxModal-buttons">
                <Button onClick={this.onCancel}>Cancel</Button>
                <Button type="submit" themeColor="green" raised>{modalAction}</Button>
              </div>
            </div>
            <div className="TuxModal-content">
              {editorSchema.map(this.renderField)}
              <div className="TuxModal-meta">
              { fullModel.sys && fullModel.sys.updatedAt && (
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
            background: #FFF;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            margin: 0;
            margin-left: auto;
            max-width: 650px;
            min-height: 100vh;
            padding: 0;
            position: relative;
            width: 60%;
          }

          .TuxModal-topBar {
            background: #f2f3f6;
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
            padding: 20px 30px;
          }

          .TuxModal-meta {
            font-size: 16px;
            margin-bottom: 20px;
            text-align: right;
          }

          .TuxModal-metaLastUpdated {
            color: ${fade(Theme.textGray, 0.5)};
            font-weight: 300;
          }

          .TuxModal-title {
            color: ${Theme.textDark};
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
