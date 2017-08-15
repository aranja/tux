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

// Material ui experimentation
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

export interface State {
  fullModel: any | null
  meta: any | null
  editorSchema: Array<Field>
}

export interface TuxModalProps {
  model: any
  onClose?: Function
  isNew?: any
}

class TuxModal extends React.Component<TuxModalProps, State> {
  static contextTypes = {
    tux: PropTypes.object
  }

  state: State = {
    fullModel: null,
    meta: null,
    editorSchema: []
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
      editorSchema: getEditorSchema(meta)
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

  onSubmit = async (event: React.FormEvent<any>) => {
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

    return (
      InputComponent &&
      <div className="TuxModal-field">
        <InputComponent
          id={field.field}
          onChange={(value: any) => this.onChange(value, field.field)}
          value={value}
          {...field.props}
        />
        <style jsx>{`
          .TuxModal-field {
            padding: 8px 0;
            font-size: 0.85rem;
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
      <MuiThemeProvider>
        <div className="TuxModal">
          {fullModel
            ? <form onSubmit={this.onSubmit}>
                <Toolbar>
                  <ToolbarGroup>
                    <h1>
                      {modalHeading}
                      <strong>
                        {'\u00A0'}
                        {meta.name}
                      </strong>
                    </h1>
                  </ToolbarGroup>

                  <ToolbarGroup>
                    <ToolbarSeparator />
                    <FlatButton
                      label="Cancel"
                      secondary
                      onClick={this.onCancel}
                    />
                    <RaisedButton label="Save" primary type="submit" />
                  </ToolbarGroup>
                </Toolbar>

                <div className="TuxModal-content">
                  {editorSchema.map(this.renderField)}
                  <div className="TuxModal-meta">
                    {fullModel.sys &&
                      fullModel.sys.updatedAt &&
                      <p className="TuxModal-metaLastUpdated">
                        Last updated{' '}
                        {moment(new Date(fullModel.sys.updatedAt)).fromNow()}
                      </p>}
                  </div>
                </div>
              </form>
            : <TuxSpinner />}
          <style jsx>{`
            .TuxModal {
              background: #fff;
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
              font-size: 12px;
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
      </MuiThemeProvider>
    )
  }
}

export default TuxModal
