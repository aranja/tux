import React from 'react'
import { EditInline } from 'tux'
import './styles.css'

const ProductBanner = ({ image }) => (
  <div className="ProductBanner">
    <div className="ProductBanner-content">
      <h1 className="ProductBanner-heading">
        <EditInline placeholder="ProductBanner heading" field="fields.content.title">
          Hello
        </EditInline>
      </h1>
      <div className="ProductBanner-text">
        <EditInline placeholder="ProductBanner body" field="fields.content.subtitle" />
      </div>
    </div>
    <div className="ProductBanner-imageWrap">
      <img className="ProductBanner-image" src={image} alt="Tux running in a Macbook"/>
    </div>
  </div>
)

export default ProductBanner
