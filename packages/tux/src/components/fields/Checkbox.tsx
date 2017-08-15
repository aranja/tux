// Todo, multiple items should be able to be checked at once.

import React from 'react'
import { Theme, input } from '../../theme'
import Checkbox from 'material-ui/Checkbox'

interface Checkbox {
  id: string
  value?: string
  checked: boolean
  label?: string
  onChange: (value: boolean) => void
}

const Check = ({ id, value, checked, onChange }: Checkbox) =>
  <Checkbox
    className="Checkbox"
    id={id}
    checked={checked}
    onCheck={event => onChange(event.target.checked)}
  />

export default Check
