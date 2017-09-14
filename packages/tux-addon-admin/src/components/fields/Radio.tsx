import React, { Component } from 'react'
import { Theme, input } from '../../theme'
import Checkbox from './Checkbox'

class Radio extends Component<any, any> {
  render() {
    const { id, choices, value, onChange } = this.props
    return (
      <div className="Radio-wrapper">
        {choices.map((choice: string) => (
          <label
            key={choice}
            className="Radio"
            htmlFor={choice}>
            {choice}
            <Checkbox
              id={choice}
              label={choice}
              checked={choice === value}
              onChange={(checked) => { onChange(checked ? choice : null) }}
            />
          </label>
        ))}

      <style jsx>{`
        .Radio-wrapper {
          display: inline-flex;
          flex-direction: column;
        }

        .Radio {
          cursor: pointer;
          display: block;
          font-size: 15px;
          line-height: 24px;
          margin-bottom: 5px;
          padding-left: 28px;
          position: relative;
          user-select: none;
        }
      `}</style>
      </div>
    )
  }
}

export default Radio
