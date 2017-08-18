import React from 'react'
import Subheader from 'material-ui/Subheader'

const style = {
  fontSize: '13px',
  lineHeight: 2,
  zIndex: 1,
  userSelect: 'none',
  color: 'rgba(0, 0, 0, 0.3)',
  paddingLeft: 0,
}

const ModalLabel = ({ children }) =>
  <Subheader style={style}>
    {children}
  </Subheader>

export default ModalLabel
