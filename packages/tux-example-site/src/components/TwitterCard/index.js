import React from 'react'
import 'whatwg-fetch'
import './styles.css'
import logo from './twitter.svg'

const TwitterCard = ({ name, handle, image, children }) => (
  <div className="TwitterCard">
    <div className="TwitterCard-top">
      <div className="TwitterCard-author">
        <img className="TwitterCard-authorImage" src={image} alt={handle}/>
        <div className="TwitterCard-authorDetails">
          <h1 className="TwitterCard-authorName">{name}</h1>
          <h2 className="TwitterCard-authorHandle">{handle}</h2>
        </div>
      </div>
      <div className="TwitterCard-logo" style={{backgroundImage: `url(${logo})`}}></div>
    </div>
    <div className="TwitterCard-content">
      <p>{children}</p>
    </div>
  </div>
)

export default TwitterCard
