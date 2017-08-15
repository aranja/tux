import React, { Component } from 'react'
import { Theme, input } from '../../theme'
import Checkbox from './Checkbox'

export interface State {
  booleanValue: boolean | null,
}

class Boolean extends Component<any, State> {
  state: State = {
    booleanValue: null,
  }

  componentDidMount() {
    const { value } = this.props

    this.setState({
      booleanValue: value
    })
  }

  onChangeValue = (checked: boolean) => {
    const { onChange } = this.props

    this.setState({
      booleanValue: checked
    })

    onChange(checked, this.props.id)
  }

  render() {
    const { booleanValue } = this.state
    const { id, boolLabels } = this.props
    const trueLabel = boolLabels[0]
    const falseLabel = boolLabels[1]

    return (
      <div className="Boolean-wrapper">
        <label className="Boolean" htmlFor={trueLabel}>
          {trueLabel}
          <Checkbox
            id={trueLabel}
            checked={booleanValue === true}
            onChange={() => this.onChangeValue(true)}
          />
        </label>

        <label className="Boolean" htmlFor={falseLabel}>
          {falseLabel}
          <Checkbox
            id={falseLabel}
            checked={booleanValue === false}
            onChange={() => this.onChangeValue(false)}
          />
        </label>

      <style jsx>{`
        .Boolean-wrapper {
        }

        .Boolean {
        }
      `}</style>
      </div>
    )
  }
}

export default Boolean
