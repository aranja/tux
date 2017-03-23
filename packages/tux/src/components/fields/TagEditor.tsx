import React, { Component } from 'react'
import classNames from 'classnames'
import { Theme, input } from '../../colors'
import { darken } from '../../utils/color'
import { decelerationCurve, sharpCurve } from '../../utils/curves'

export interface TagEditorProps {
  id: string
  value: Array<string>
  onChange: (e: Array<string>) => void
  hasFocus: boolean
}

type Tags = Array<string>
type TagObj = {
  singleValue: string
}

class TagEditor extends Component<TagEditorProps, any> {

  private tagEditor: HTMLElement
  private isUnmounting: boolean

  state = {
    tags: [],
    hasFocus: false,
  }

  componentWillUnmount() {
    this.tagEditor.removeEventListener('keypress', this.handleOnKeyUp)
    this.isUnmounting = true
  }

  componentDidMount() {
    this.tagEditor.addEventListener('keypress', this.handleOnKeyUp)

    const { value } = this.props
    const prevTags: Array<string> = []
    const isArray = value instanceof Array

    if (value && isArray) {
      value.map((value) => {
        prevTags.push(value)
      })

      this.setState({
        tags: prevTags
      })
    }

  }

  onItemAdded = (newTags: Tags) => {
    const { onChange } = this.props

    if (!this.isUnmounting) {
      onChange(newTags)
    }
  }

  onItemDeleted = (tag: Tags) => {
    const { onChange } = this.props

    onChange(tag)
  }

  handleClickDelete = (item: TagObj) => {
    const { tags } = this.state

    const newTags: Tags = tags
    const tagPosition = newTags.indexOf(item.singleValue)

    if (tagPosition > -1) {
      newTags.splice(tagPosition, 1)
      this.onItemDeleted(newTags)
    }
  }

  handleFocus = () => {
    const { hasFocus } = this.state
    this.setState({
      hasFocus: true,
    })
  }

  handleBlur = () => {
    const { hasFocus } = this.state
    this.setState({
      hasFocus: false,
    })
  }

  handleOnKeyUp = (event: any) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    const { onChange } = this.props
    const { tags } = this.state
    const prevTags = tags
    const newTags = prevTags.concat(event.target.value)

    this.setState({
      tags: newTags
    })

    this.onItemAdded(newTags)
  }

  render() {
    const { id, value, onChange } = this.props
    const { hasFocus } = this.state

    return (
      <div className={classNames('TagEditor', hasFocus && 'has-focus')}>
        <div className="TagEditor-input">
          <input
            ref={(tagEditor) => {this.tagEditor = tagEditor}}
            className="TagEditor-inputField"
            placeholder="Add item"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <hr className="TagEditor-underline TagEditor-underline--passive" />
          <hr className="TagEditor-underline TagEditor-underline--active" />
        </div>
        <div className="TagEditor-tags">
          {value instanceof Array && value.map((singleValue) => (
            <p key={singleValue} className="TagEditor-tag">
            {singleValue}
            <span
            className="TagEditor-tagButton"
            onClick={() => this.handleClickDelete({singleValue})}>
            </span>
            </p>
          ))}
        </div>
        {/* Todo: replace with tuxTheme.tagEditor */}
          <style jsx>{`
            .TagEditor {

            }

            .TagEditor-tags {
              display: flex;
              flex-wrap: wrap;
              margin: 10px -5px;
            }

            .TagEditor-tag {
              background: ${Theme.gray};
              border-radius: 20px;
              border: 1px solid ${input.default.border};
              color: ${input.default.labelText};
              display: flex;
              font-size: 12px;
              padding: 5px 15px;
              padding-right: 0;
              margin: 0 3px;
            }

            .TagEditor-tagButton {
              cursor: pointer;
              color: ${Theme.gray};
              display: flex;
              align-items: center;
              justify-content: center;
              width: 1.5em;
              height: 1.5em;
              background: ${darken(Theme.gray, 0.22)};
              font-family: 'mfg_labs_iconsetregular';
              font-style: normal;
              speak: none;
              font-weight: normal;
              font-size: 1em;
              margin: 0 0.5em;
              border-radius: 50%;
              transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
              -webkit-font-smoothing: antialiased;
            }

            .TagEditor-tagButton::after {
                content: "\\274C";
            }

            .TagEditor-input {
              width: 100%;
              position: relative;
            }

            .TagEditor-inputField {
              background: #FFF;
              border: 0;
              font-size: 15px;
              padding: 0;
              padding-bottom: 8px;
              width: 100%;
            }

            .TagEditor-inputField:focus {
              outline: 0;
            }

            .TagEditor-underline {
              border: 0;
              bottom: 0;
              left: 0;
              position: absolute;
              width: 100%;
            }

            .TagEditor-underline--passive {
              border-bottom: 1px solid #e0e0e0;
              margin: 0;
            }

            .TagEditor-underline--active {
              transition: transform 0.25s cubic-bezier(${decelerationCurve});
              border-bottom: 1px solid ${Theme.primary};
              margin: 0;
              transform: scaleX(0);
            }

            .TagEditor.has-focus .TagEditor-underline--active {
              transform: scaleX(1);
            }
          `}</style>
      </div>
    )
  }
}

export default TagEditor
