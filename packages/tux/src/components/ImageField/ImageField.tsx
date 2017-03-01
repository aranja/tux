import React from 'react'
import classNames from 'classnames'

import { InputStyles } from '../../styles'
import TextField from '../TextField'

const BrowseField = ({ id, value, label, helpText, onChange } : any) => (
  <RaisedButton
    className="TuxModal-saveBtn"
    containerElement="label"
    label={label}
    labelPosition="before"
  >
    <input
      className="TuxModal-fileInput"
      id={id}
      type="file"
      value={value}
    />
  </RaisedButton>
)

export interface ImageFieldProps {
  model : any,
  field : string | Array<string>,
  onChange : Function,
  id: string,
  name: string,
  label: string,
  helpText: string,
  value: string,
}

class ImageField extends React.Component<ImageFieldProps, any> {
  constructor(props : ImageFieldProps) {
    super(props)

    this.state = {
      isToggled: false,
      newImageValue: '',
    }
  }

  onCardClick = () => {
    const { isToggled } = this.state
    this.setState({ isToggled: !isToggled})
  }

  onUrlChange = (value : any, type : {id : string}) => {
    const { id, model } = this.props

    this.setState({
      newImageValue: value,
    })

    const fields = {
      contentType: 'image/jpeg',
      fileName: model.fields[id].asset.file.fileName,
      url: value,
    }

    this.props.onChange(
      fields,
      type,
    )
  }

  render() {
    const { model, value, id, name, onChange } = this.props
    const { isToggled, newImageValue } = this.state

    const imageField = model.fields[id]
    if (imageField) {
      return (
        <div style={{
          display: 'flex',
        }}>
          <div style={{
            flex: 1,
          }}>
            <label className="InputLabel">{name} <small>(click image to edit)</small></label>
            <img
              alt={imageField.asset.file.title}
              width="200"
              height="200"
              src={`${imageField.asset.file.url}?w=200&h=200`}
              onClick={this.onCardClick}
            />
          </div>
          <div style={{
            flex: 1,
          }}>
            {isToggled ? (
              <TextField
                helpText="URL to image"
                id={id}
                label={`New image for ${name}`}
                onChange={this.onUrlChange}
                value={newImageValue}
              />
            ) : null}
          </div>
          <style jsx>{`
            .InputLabel {
              color: ${InputStyles.labelTextColor};
              font-size: 14px;
              line-height: 24px;
            }
          `}</style>
        </div>
      )
    }
    return (
      <div>Here be image field</div>
    )
  }
}

export default ImageField
