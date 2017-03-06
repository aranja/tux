import React from 'react'
import classNames from 'classnames'

import { tuxInputStyles } from '../../styles'
import TextField from './TextField'

class BrowseField extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  onChange = (event: React.FormEvent<any>) => {
    const { onChange } = this.props
    const { input } = this.refs

    if (input.files.length) {
      onChange(input.files)
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
  field: string | Array<string>,
  helpText: string,
  id: string,
  imageUrl: string,
  label: string,
  name: string,
  onChange: Function,
  value: {
    sys: {
      id: string,
      type: string,
      linkType: string,
    }
  },
}

class ImageField extends React.Component<ImageFieldProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  constructor(props: ImageFieldProps) {
    super(props)

    this.state = {
      isToggled: false,
      imageUrl: '',
      fullModel: null,
    }
  }

  async componentDidMount() {
    const { value } = this.props
    const fullModel = await this.context.tux.adapter.loadAsset(value)

    this.setState({
      fullModel
    })
  }

  async componentWillReceiveProps(props: ImageFieldProps) {
    if (!props.value || !props.value.sys) {
      return
    }

    if (props.value.sys.id !== this.props.value.sys.id) {
      const fullModel = await this.context.tux.adapter.loadAsset(props.value)

      this.setState({
        fullModel
      })
    }
  }

  onCardClick = () => {
    const { isToggled } = this.state
    this.setState({ isToggled: !isToggled})
  }

  onFileChange = async(files: FileList) => {
    const { onChange } = this.props

    this.setState({
      isLoadingImage: true,
    })

    const asset = await this.context.tux.adapter.createAssetFromFile(files[0], 'Some title')

    onChange({
      sys: {
        id: asset.sys.id,
        linkType: 'Asset',
        type: 'Link'
      }
    }, {
      type: this.props.id
    })

    this.setState({
      isLoadingImage: false,
    })
  }

  onUrlChange = async(event: React.ChangeEvent<any>) => {
    this.setState({
      imageUrl: event.target.value
    })
  }

  loadImageFromUrl = async() => {
    const { onChange } = this.props
    const { imageUrl } = this.state

    this.setState({
      isLoadingImage: true,
    })

    const asset = await this.context.tux.adapter.createAssetFromUrl(
      imageUrl,
      'test-image.jpeg',
      'en-US',
      'Test Image'
    )

    onChange({
      sys: {
        id: asset.sys.id,
        linkType: 'Asset',
        type: 'Link'
      }
    }, {
      type: this.props.id
    })

    this.setState({
      isLoadingImage: false,
      imageUrl: '',
    })
  }

  render() {
    const { value, id, onChange, label } = this.props
    const { isToggled, imageUrl, fullModel, isLoadingImage } = this.state

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
            <label className="InputLabel">
              {label} <small>(click image to edit)</small>
            </label>
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
            {isToggled && (
              <div>
                <BrowseField
                  id={id}
                  label={`New image for ${label}`}
                  onChange={this.onFileChange}
                  value=""
                />
                {isLoadingImage ? (
                  <p>Loading image ... </p>
                ) : null}
              </div>
            )}
          </div>
          <style jsx>{`
            .InputLabel {
              color: ${tuxInputStyles.labelTextColor};
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
