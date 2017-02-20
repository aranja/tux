import React from 'react'
import Menu from '../Menu'
import './styles.css'

const Banner = ({ color, children }) => (
  <div className="Banner" style={{backgroundColor: color}}>
    <Menu />
    <h1 className="Banner-heading">{children}</h1>
  </div>
)

export default Banner
