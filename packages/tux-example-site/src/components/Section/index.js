// Incomplete.

import React from 'react'

import './styles.css'

const Section = ({ image = false, imagePosition = 'right', imageUrl = 'https://placehold.it/1440/1600/e8008a', children }) => (
  <div>
    {image && (
      <section className="Section">
        <div className="Section--half"> {children} </div>
        <div className="Section--half Section--image" style={{backgroundImage: `url(${imageUrl})`}}></div>
      </section>
    )}
  </div>
)

export default Section
