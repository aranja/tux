import React from 'react'
import { EditModal } from 'tux-addon-admin'

import './styles.css'

const Gallery = ({ galleryItems }) => (
  <div className="Gallery">
    {galleryItems &&
      galleryItems.map(item => (
        <div key={item.fields.title} className="Gallery-item">
          <EditModal model={item}>
            <div
              className="Gallery-itemImage"
              style={{
                backgroundImage: `url(${item.fields.image.fields.file.url})`,
              }}
            />
            <div className="Gallery-itemContent">
              <h1 className="Gallery-itemTitle">{item.fields.title}</h1>
              <p className="Gallery-itemCopy">{item.fields.text}</p>
            </div>
          </EditModal>
        </div>
      ))}
  </div>
)

export default Gallery
