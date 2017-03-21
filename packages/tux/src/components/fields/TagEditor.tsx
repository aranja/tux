import React, { Component } from 'react'
import { Theme, input } from '../../theme'
import { darken } from '../../utils/color'

export interface TagEditorProps {
  id: string
  value: Array<string>
  onChange: (e: Array<string>) => void
}

type Tags = Array<string>
type TagObj = {
  singleValue: string
}

class TagEditor extends Component<TagEditorProps, any> {

  private tagEditor: HTMLElement
  private isUnmounting: boolean

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

  onItemAdded = (newTags: Tags) => {
    const { onChange } = this.props
    console.log(newTags)
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

    return (
      <div className="TagEditor">
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

            .TagEditor-tags {
              display: flex;
              flex-wrap: wrap;
              margin: 10px -5px;
            }

            .TagEditor-tag {
              background: ${Theme.gray};
              border-radius: 20px;
              border: 1px solid ${input.border};
              color: ${input.labelText};
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
              background: #FFF;
              border: 1px solid ${input.border};
              border-radius: 3px;
              color: ${Theme.textDark};
              font-size: 16px;
              padding: 5px;
              line-height: 1.5;
              width: 100%;
            }

            .TagEditor-input:focus {
              border-color: ${input.greenTheme.border};
              outline: 1px solid ${input.greenTheme.border};
            }
          `}</style>
      </div>
    )
  }
}

export default TagEditor
