import React from 'react'
import Menu from '../Menu'
import './styles.css'

const Banner = ({ color }) => (
  <div className="Banner" style={{backgroundColor: color}}>
    <Menu />
    <h1 className="Banner-heading">
      Hello, this is the Tux demo.
      <br />Make yourself at home and try out some of Tux’s super powers.
    </h1>
  </div>
)

export default Banner
