import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card'
import { get } from '../../utils/accessors'
import { input } from '../../theme'
import Spinner from '../Spinner'
import BrowseField from './BrowseField'

export interface ImageFieldProps {
  field: string | Array<string>
  id: string
  name: string
  onChange: Function
  value: any
}

const style = {
  Card: { padding: '15px' },
  CardHeader: { padding: 0, paddingBottom: '15px' }
}

class ImageField extends React.Component<ImageFieldProps, any> {
  static contextTypes = {
    tux: PropTypes.object
  }

  constructor(props: ImageFieldProps) {
    super(props)

    this.state = {
      fullModel: null,
      isLoadingImage: false
    }
  }

  async componentDidMount() {
    const { value } = this.props

    let fullModel = null
    if (value instanceof Object) {
      fullModel = await this.context.tux.adapter.loadAsset(value)
    } else {
      fullModel = this.context.tux.adapter.createAsset(value)
    }

    this.setState({
      fullModel
    })
  }

  async componentWillReceiveProps(props: ImageFieldProps) {
    if (!props.value) {
      return
    }

    if (props.value !== this.props.value) {
      const fullModel = await this.context.tux.adapter.loadAsset(props.value)

      this.setState({
        fullModel,
        isLoadingImage: false
      })
    }
  }

  onFileChange = async (files: FileList) => {
    const { onChange } = this.props

    this.setState({
      isLoadingImage: true
    })

    const asset = await this.context.tux.adapter.createAssetFromFile(
      files[0],
      'Some title'
    )

    onChange(asset)
  }

  render() {
    const { value, id, onChange } = this.props
    const { fullModel, isLoadingImage } = this.state

    if (fullModel) {
      const title = get(fullModel, 'fields.title')
      const url = get(fullModel, 'fields.file.url')

      return (
        <Card style={style.Card}>
          <CardHeader style={style.CardHeader} subtitle="Upload image" />
          <div className="ImageField">
            {isLoadingImage
              ? <div className="ImageField-preview">
                  <Spinner />
                </div>
              : url
                ? <div className="ImageField-preview">
                    <img
                      className="ImageField-previewImage"
                      alt={title}
                      width="128"
                      height="auto"
                      src={`${url}?w=128`}
                    />
                  </div>
                : null}
            <BrowseField id={id} onChange={this.onFileChange} value="" />
            <style jsx>{`
              .ImageField {
                display: inline-block;
              }
              .ImageField-preview {
                display: inline-block;
                height: 140px;
                overflow: hidden;
                padding: 6px;
                position: relative;
                width: 140px;
              }
              .ImageField-preview > img {
                height: 100%;
                object-fit: contain;
              }
            `}</style>
          </div>
        </Card>
      )
    }
    return <div>Loading</div>
  }
}

export default ImageField
