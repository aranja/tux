import React from 'react'
import './styles.css'

const ProductBanner = ({ image, heading, text }) => (
  <div className="ProductBanner">
    <div className="ProductBanner-image" style={{backgroundImage: `url(${image})`}}></div>
    <div className="ProductBanner-content">
      <h1 className="ProductBanner-heading">{heading}</h1>
      <p className="ProductBanner-text">{text}</p>
    </div>
  </div>
)

export default ProductBanner
