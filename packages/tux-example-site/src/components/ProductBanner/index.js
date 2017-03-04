import React from 'react'
import './styles.css'

const ProductBanner = ({ image, heading, text }) => (
  <div className="ProductBanner">
    <div className="ProductBanner-content">
      <h1 className="ProductBanner-heading">{heading}</h1>
      <p className="ProductBanner-text">{text}</p>
    </div>
    <div className="ProductBanner-imageWrap">
      <img className="ProductBanner-image" src={image} alt="Tux running in a Macbook"/>
    </div>
  </div>
)

export default ProductBanner
