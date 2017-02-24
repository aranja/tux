import React from 'react'
import './styles.css'

const Banner = ({ color, children }) => (
  <div className="Banner" style={{backgroundColor: color}}>
    <h1 className="Banner-heading">{children}</h1>
  </div>
)

export default Banner
