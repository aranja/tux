import React, { Component } from 'react'
import { tuxColors, tuxInputStyles } from '../../styles'

export interface TagEditorProps {
  id: string
  value: Array<string>
  label: string
  helpText: string
  onChange: (e: React.FormEvent<any>) => void
}

class TagEditor extends Component<TagEditorProps, any> {

  state = {
    tags: []
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

  onItemAdded = (newTags) => {
    const { onChange } = this.props

    if (!this.isUnmounting) {
      onChange(newTags)
    }
  }

  onItemDeleted = (tag) => {
    const { onChange } = this.props

    onChange(tag)
  }

  handleClickDelete = (item) => {
    const { tags } = this.state
    const newTags = tags
    const tagPosition = newTags.indexOf(item.singleValue)

    if (tagPosition > -1) {
      newTags.splice(tagPosition, 1)
      this.onItemDeleted(newTags)
    }
  }

  handleOnKeyUp = (event) => {
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
    const { id, value, label, onChange } = this.props

    return (
      <div className="TagEditor">
        <label className="TagEditor-label">{label}</label>
        <input
          ref={(tagEditor) => {this.tagEditor = tagEditor}}
          className="TagEditor-input"
          placeholder="Add item"
          onClick={this.handleOnKeyUp}
        />
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
          <style jsx>{`
            .TagEditor {
              display: flex;
              flex-direction: column;
            }

            .TagEditor-label {
              color: ${tuxInputStyles.labelTextColor};
              font-size: 16px;
              font-weight: 300;
              line-height: 1.5;
              padding: 4px 0;
              text-transform: capitalize;
            }

            .TagEditor-tags {
              display: flex;
              flex-wrap: wrap;
              margin: 10px -5px;
            }

            .TagEditor-tag {
              background: ${tuxColors.colorWhite};
              border-radius: 20px;
              border: 1px solid ${tuxInputStyles.borderColor};
              color: ${tuxInputStyles.labelTextColor};
              font-size: 13px;
              padding: 4px 12px;
              margin: 5px;
            }

            .TagEditor-tag:not(:last-child) {
            }

            .TagEditor-tagButton {
              font-family: 'mfg_labs_iconsetregular';
              font-style: normal;
              speak: none;
              font-weight: normal;
              font-size: 1em;
              -webkit-font-smoothing: antialiased;
            }

            .TagEditor-tagButton::after {
                content: "\\274C";
                padding-left: 10px;
            }

            .TagEditor-input {
              background: ${tuxColors.colorWhite};
              border: 1px solid ${tuxInputStyles.borderColor};
              border-radius: 3px;
              color: ${tuxColors.textDark};
              font-size: 16px;
              padding: 5px;
              line-height: 1.5;
              width: 100%;
            }

            .TagEditor-input:focus {
              border-color: ${tuxInputStyles.greenTheme.borderColor};
              outline: 1px solid ${tuxInputStyles.greenTheme.borderColor};
            }
          `}</style>
      </div>
    )
  }
}

export default TagEditor
