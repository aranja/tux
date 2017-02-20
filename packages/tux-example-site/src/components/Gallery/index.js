import React from 'react'

import './styles.css'
import image1 from './Image1.jpg'
import image2 from './Image2.jpg'
import image3 from './Image3.jpg'

const defaultData = [
  { image: image1, title: 'Have some iced tea', copy: 'Persius laboramus pro in. Mutat harum nam ei. Eam in graeco offendit. Reque saepe nusquam qui ea, ad nonumy causae molestie nam. Alia vocibus invidunt in mea.' },
  { image: image2, title: 'Hold your dog up high', copy: 'Molestiae ratione doloremque nam nostrum temporibus at harum ipsa consequuntur alias dolor. Facere ex ipsam vero ipsa possimus, accusamus debitis perspiciatis eius nam suscipit!' },
  { image: image3, title: 'Evil buildings', copy: 'Accusamus modi perferendis iste, labore voluptates ut asperiores voluptatibus qui architecto, soluta. Dolore cumque maiores expedita dignissimos laborum, nemo beatae ipsa rem.' }
]

const Gallery = ({ data = defaultData }) => (
  <div className="Gallery">
    {data && data.map((data) => (
      <div key={data.title} className="Gallery-item">
        <div className="Gallery-itemImage" style={{backgroundImage: `url(${data.image})`}}></div>
        <div className="Gallery-itemContent">
          <h1 className="Gallery-itemTitle">{data.title}</h1>
          <p className="Gallery-itemCopy">{data.copy}</p>
        </div>
      </div>
    ))}
  </div>
)

export default Gallery
