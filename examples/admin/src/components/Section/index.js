import React from 'react'

import './styles.css'

const Section = ({ backgroundColor, children }) => {
  const styles = {}
  if (backgroundColor) {
    styles.backgroundColor = backgroundColor
  }

  return (
    <section className="Section" style={styles}>
      {children}
    </section>
  )
}

export default Section
