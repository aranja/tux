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
  field : string | Array<string>,
  helpText: string,
  id: string,
  imageUrl: string,
  label: string,
  name: string,
  onChange : Function,
  value: string,
}

class ImageField extends React.Component<ImageFieldProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  constructor(props : ImageFieldProps) {
    super(props)

    this.state = {
      isToggled: false,
      imageUrl: '',
      fullModel: null,
    }
  }

  async componentDidMount() {
    const { value } = this.props

    console.log('ImageField.componentDidMount')
    console.log(value)

    const [
      fullModel,
      typeMeta,
    ] = await Promise.all([
      this.context.tux.adapter.loadAsset(value)
    ])

    console.log(fullModel)
    this.setState({
      fullModel
    })
  }

  async componentDidReciveProps(props : ImageFieldProps) {
    console.log('Component received props')
  }

  onCardClick = () => {
    const { isToggled } = this.state
    this.setState({ isToggled: !isToggled})
  }

  onFileChange = async(files : FileList) => {
    const { onChange } = this.props

    this.setState({
      loading: true,
    })

    const asset = await this.context.tux.adapter.createAssetFromFile(files[0])

    onChange({
      id: asset.sys.id,
      linkType: 'Asset',
      type: 'Link'
    })

    this.setState({
      loading: false,
    })
  }

  onUrlChange = async(value : any, type : {id : string}) => {
    this.setState({
      imageUrl: value
    })
  }

  loadImageFromUrl = () => {
    const { onChange } = this.props
    const { imageUrl } = this.state
  }

  render() {
    const { value, id, name, onChange } = this.props
    const { isToggled, imageUrl, fullModel } = this.state

    if (fullModel) {
      const title = fullModel.fields.title['en-US']
      const url = fullModel.fields.file['en-US'].url
      return (
        <div style={{
          display: 'flex',
        }}>
          <div style={{
            flex: 1,
          }}>
            <label className="InputLabel">{name} <small>(click image to edit)</small></label>
            <img
              alt={title}
              width="200"
              height="200"
              src={`${url}?w=200&h=200`}
              onClick={this.onCardClick}
            />
          </div>
          <div style={{
            flex: 1,
          }}>
            {isToggled ? (
              <div>
                <TextField
                  helpText="URL to image"
                  id={id}
                  label={`New image for ${name}`}
                  onChange={this.onUrlChange}
                  // ref="browseField"
                  value={imageUrl}
                />
                <input type="button" onClick={this.loadImageFromUrl} value="Load" />
              </div>
            ) : null}
          </div>
          <style jsx>{`
            .InputLabel {
              color: ${InputStyles.labelTextColor};
              display: block;
              font-size: 14px;
              line-height: 24px;
            }
          `}</style>
        </div>
      )
    }
    return (
      <div>Loading</div>
    )
  }
}

export default ImageField
