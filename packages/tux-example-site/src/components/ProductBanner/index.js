import React from 'react'
import './styles.css'

const ProductBanner = ({ image, children }) => (
  <div className="ProductBanner">
    <div className="ProductBanner-content">
      {children}
    </div>
    <div className="ProductBanner-imageWrap">
      <img className="ProductBanner-image" src={image} alt="Tux running in a Macbook"/>
    </div>
  </div>
)

export default ProductBanner
