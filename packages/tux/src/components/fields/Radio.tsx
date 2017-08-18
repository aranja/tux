import React, { Component } from 'react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card'
import { Theme, input } from '../../theme'
import Checkbox from './Checkbox'
import ModalLabel from '../ModalLabel'

class Radio extends Component<any, any> {
  render() {
    const { id, choices, value, onChange } = this.props
    return [
      <ModalLabel>Radio</ModalLabel>,
      <RadioButtonGroup name={id} defaultSelected={value}>
        {choices.map((choice: string) =>
          <RadioButton key={choice} value={choice} label={choice} />
        )}
      </RadioButtonGroup>
    ]
  }
}

export default Radio
