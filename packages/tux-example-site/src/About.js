import React from 'react'
import { Editable, connect } from 'tux'
import { H1, H2 } from './components/typography'
import ProductBanner from './components/ProductBanner'
import Section from './components/Section'
import SellPoints from './components/SellPoints'
import Carousel from './components/Carousel'
import Testimonial from './components/Testimonial'
import Gallery from './components/Gallery'
import SocialPlug from './components/SocialPlug'
import Pricetable from './components/Pricetable'

import './reset.css'
import './megadraft.css'
import './megadraft-fixes.css'

const About = ({ pages, articles, sellPoints }) => {
  if (!pages) return null

  const page = pages.items[0]

  return (
    <div className="p-About">
      <ProductBanner />
      <Section>
        <H1><Editable model={page} field="fields.content.tagline" /></H1>
        <SellPoints sellPoints={sellPoints.items} />
      </Section>
    </div>
  )
}

export default connect(async contentful => ({
  pages: await contentful.getEntries({ content_type: 'page' }),
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
  sellPoints: await contentful.getEntries({ content_type: 'sellPoint' }),
}))(About)
