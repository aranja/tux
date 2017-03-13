import React, { Component } from 'react'
import { tuxButtonStyles } from '../../styles'

class BrowseField extends Component<any, any> {
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
      <div className="BrowseField">
        <label className="BrowseField-button"
          role="button"
          aria-label="Browse for files"
          htmlFor={id}>
            Browse for files
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
            clip: rect(0, 0, 0, 0);
            position: absolute !important;
            height: 0;
            width: 0;
            overflow: hidden;
          }

          .BrowseField-button {
            background: ${tuxButtonStyles.backgroundColor};
            border-radius: 2px;
            border: 1px solid ${tuxButtonStyles.borderColor};
            color: ${tuxButtonStyles.textColor};
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.3;
            margin: 0;
            margin-top: 5px;
            padding: 6px;
            text-align: center;
            transition: all 0.25s;
            vertical-align: baseline;
            width: 100%;
          }

          .BrowseField-button::before {
            content: "\\f068";
            font-family: "mfg_labs_iconsetregular";
            padding-right: 10px;
          }

          .BrowseField-button:hover {
            background: ${tuxButtonStyles.greenTheme.backgroundColor};
            border: 1px solid ${tuxButtonStyles.greenTheme.borderColor};
            color: ${tuxButtonStyles.greenTheme.textColor};
          }
        `}</style>
      </div>
    )
  }
}

export default BrowseField
