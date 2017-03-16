import React from 'react'
import { EditInline } from 'tux'
import './styles.css'

const ProductBanner = ({ image, model }) => (
  <div className="ProductBanner">
    <div className="ProductBanner-content">
      <EditInline className="ProductBanner-heading" field="fields.content.title" />
      <EditInline className="ProductBanner-text" field="fields.content.subtitle" />
    </div>
    <div className="ProductBanner-imageWrap">
      <img className="ProductBanner-image" src={image} alt="Tux running in a Macbook"/>
    </div>
  </div>
)

export default ProductBanner
