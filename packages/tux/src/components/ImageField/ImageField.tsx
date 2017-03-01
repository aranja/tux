import React = require('react')
import classNames = require('classnames')

import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardHeader, CardText, CardMedia} from 'material-ui/Card'
import MaterialTextField from 'material-ui/TextField'

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

  onUrlChange = (event : React.ChangeEvent<any>, type : {id : string}) => {
    const { id, model } = this.props

    this.setState({
      newImageValue: event.target.value
    })

    const value = {
      contentType: 'image/jpeg',
      fileName: model.fields[id].asset.file.fileName,
      url: event.target.value
    }

    this.props.onChange(
      value,
      type,
    )
  }

  render() {
    const { model, value, id, name, onChange } = this.props
    const { isToggled, newImageValue } = this.state

    const imageField = model.fields[id]
    if (imageField) {
      return (
        <div>
          <Card>
            <CardHeader
              subtitle={name}
            />
            <CardMedia>
              <img
                alt={imageField.asset.file.title}
                width="200"
                height="200"
                src={`${imageField.asset.file.url}?w=200&h=200`}
                onClick={this.onCardClick}
              />
            </CardMedia>
            <CardText>
              {isToggled ? (
                <MaterialTextField
                  floatingLabelText="New image URL"
                  hintText="www.example.com/image.jpg"
                  value={newImageValue}
                  id={id}
                  onChange={this.onUrlChange}
                />
              ) : <p>Click image to edit</p>}
            </CardText>
          </Card>
        </div>
      )
    }
    return (
      <div>Here be image field</div>
    )
  }
}

export default ImageField
