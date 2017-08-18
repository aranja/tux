import React from 'react'
import { EditInline } from 'tux'
import './styles.css'

const ProductBanner = ({ image }) =>
  <div className="ProductBanner">
    <div className="ProductBanner-content">
      <h1 className="ProductBanner-heading">
        <EditInline field="fields.content.title" />
      </h1>
      <div className="ProductBanner-text">
        <EditInline field="fields.content.subtitle" />
      </div>
    </div>
    <div className="ProductBanner-imageWrap">
      <img
        className="ProductBanner-image"
        src={image}
        alt="Tux running in a Macbook"
      />
    </div>
  </div>

export default ProductBanner
