import React from 'react'
import classNames from 'classnames'

import { InputStyles } from '../../styles'
import TextField from '../TextField'

class BrowseField extends React.Component<any, any> {
  constructor(props : any) {
    super(props)
  }

  onChange = (event : React.FormEvent<any>) => {
    const { onChange } = this.props
    const { input } = this.refs
    console.log('BrowseFieldClass.onFileSelected')
    if (input.files.length) {
      onChange(input.files)
    } else {
      console.log('No files')
    }
  }

  render() {
    const { id, value, onChange } = this.props

    return (
      <div>
        <label htmlFor={id}>
          New image
        </label>
        <input
          className="BrowseField-fileInput"
          id={id}
          onChange={this.onChange}
          ref="input"
          type="file"
          value={value}
        />
        <style jsx>{`
          .BrowseField-fileInput {

          }
        `}</style>
      </div>
    )
  }
}

export interface ImageFieldProps {
  model : any,
  field : string | Array<string>,
  onChange : Function,
  id: string,
  name: string,
  label: string,
  helpText: string,
  value: string,
  adapter: any,
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

  onFileChange = async(files : FileList) => {
    const { onChange } = this.props
    console.log('ImageField.onFileChange')
    console.log(files)

    // this.setState({
    //   loading: true,
    // })
    //
    // const asset = await this.context.tux.adapter.createAssetFromFile(files[0])
    //
    // onChange({
    //   id: asset.sys.id,
    //   linkType: 'Asset',
    //   type: 'Link'
    // })
    //
    // this.setState({
    //   loading: false,
    // })
  }

  onUrlChange = (value : any, type : {id : string}) => {
    const { id, model } = this.props

    this.setState({
      newImageValue: value,
    })

    const fields = {
      contentType: 'image/jpeg',
      fileName: model.fields[id].asset.file.fileName,
      upload: value,
    }

    // setState(isUploading: true)
    // const asset = await adapter.createAssetFromFile(file)
    //
    // const formData = new FormData()
    // formData.add('ldskjf', file)

    // this.props.onChange(
    //   asset
    // )
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
              <BrowseField
                helpText="URL to image"
                id={id}
                label={`New image for ${name}`}
                onChange={this.onFileChange}
                ref="browseField"
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
