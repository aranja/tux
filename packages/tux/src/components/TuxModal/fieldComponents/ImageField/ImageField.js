import React = require('react')
import classNames = require('classnames')

import RaisedButton from 'material-ui/RaisedButton'

const BrowseField = ({ id, value, label, helpText, onChange } : any) => (
  <RaisedButton
    className="TuxModal-saveBtn"
    containerElement="label"
    label={label}
    labelPosition="before"
  >
    <input
      className="TuxModal-fileInput"
      id={id}
      type="file"
      value={value}
    />
  </RaisedButton>
)

const ImageField = (props) => {
  console.log(props)
  return (
    <div>Here be image field</div>
  )
}

export default ImageField
