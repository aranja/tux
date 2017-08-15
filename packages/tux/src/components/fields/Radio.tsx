import React, { Component } from 'react'
import { Theme, input } from '../../theme'
import Checkbox from './Checkbox'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const style = {
  Card: { padding: '15px' },
  CardHeader: { padding: 0, paddingBottom: '15px' }
}

class Radio extends Component<any, any> {
  render() {
    const { id, choices, value, onChange } = this.props
    return (
      <Card style={style.Card}>
        <CardHeader
          style={style.CardHeader}
          subtitle="Radio"
        />
      <RadioButtonGroup name={id} defaultSelected={value}> 
        {choices.map((choice: string) =>
          <RadioButton
            key={choice}
            value={choice}
            label={choice}
          />
        )}
      </RadioButtonGroup>
      </Card>
    )
  }
}

export default Radio
