import React from 'react'
import classNames from 'classnames'
import { get } from '../../utils/accessors'

import { tuxInputStyles } from '../../styles'
import TextField from './TextField'
import BrowseField from './BrowseField'

export interface ImageFieldProps {
  field: string | Array<string>,
  helpText: string,
  id: string,
  imageUrl: string,
  label: string,
  name: string,
  onChange: Function,
  value: any,
}


class ImageField extends React.Component<ImageFieldProps, any> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  constructor(props: ImageFieldProps) {
    super(props)

    this.state = {
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
    if (!props.value) {
      return
    }

    const nextValueId = this.context.tux.adapter.getIdOfEntity(props.value)
    const currentValueId = this.context.tux.adapter.getIdOfEntity(this.props.value)

    if ((nextValueId !== currentValueId) && nextValueId !== null) {
      const fullModel = await this.context.tux.adapter.loadAsset(props.value)

      this.setState({
        fullModel
      })
    }
  }

  onFileChange = async(files: FileList) => {
    const { onChange } = this.props

    this.setState({
      isLoadingImage: true,
    })

    const asset = await this.context.tux.adapter.createAssetFromFile(files[0], 'Some title')
    const linkableAsset = this.context.tux.adapter.formatAssetForLinking(asset)

    onChange(linkableAsset)

    this.setState({
      isLoadingImage: false,
    })
  }

  onUrlChange = async(event: React.ChangeEvent<any>) => {
    this.setState({
      imageUrl: event.target.value
    })
  }

  render() {
    const { value, id, onChange, label } = this.props
    const { imageUrl, fullModel, isLoadingImage } = this.state

    if (fullModel) {
      const title = get(fullModel, 'fields.title')
      const url = get(fullModel, 'fields.file.url')

      return (
          <div className="ImageField">
            <label className="InputLabel">{label}</label>
            <div className="ImageField-preview">
              <img
              className="ImageField-previewImage"
              alt={title}
              width="128"
              height="auto"
              src={`${url}?w=128`}
              />
            </div>
            <BrowseField
              id={id}
              label={`New image for ${label}`}
              onChange={this.onFileChange}
              value=""
            />
            {isLoadingImage ? (
              <p>Loading image ... </p>
            ) : null}
            <style jsx>{`
              .ImageField {
                display: inline-flex;
                flex-direction: column;
                margin-bottom: 20px;
              }
              .ImageField-preview {
                background: white;
                border: 1px solid ${tuxInputStyles.borderColor};
                border-radius: 3px;
                display: inline-block;
                padding: 6px;
              }
              .InputLabel {
                color: ${tuxInputStyles.labelTextColor};
                display: block;
                font-size: 16px;
                font-weight: 300;
                line-height: 24px;
                padding: 5px 0;
                text-transform: capitalize;
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