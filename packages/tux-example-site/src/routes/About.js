import React from 'react'
import { Editable, connect } from 'tux'
import { H1, H2 } from '../components/typography'
import Pricetable from '../components/Pricetable'
import Menu from '../components/Menu'
import Articles from '../components/Articles'
import Gallery from '../components/Gallery'
import ProductBanner from '../components/ProductBanner'
import Section from '../components/Section'
import SocialPlug from '../components/SocialPlug'

import ProductBannerImage from '../ProductBannerImage.png'


const About = ({ pages, articles, sellPoints, gallery, testimonial, pricetable }) => {

  if (!pages) return null
  const page = pages.items[0]

  return (
    <div className="p-About">
      <Menu />
      <ProductBanner image={ProductBannerImage}>
        <div className="ProductBanner-heading"><Editable model={page} field="fields.content.title" /></div>
        <div className="ProductBanner-text"><Editable model={page} field="fields.content.subtitle" /></div>
      </ProductBanner>
      <Section>
        <H1>Who is using Tux</H1>
        <Gallery galleryItems={gallery.items} />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
      </Section>
      <Section>
        <H1>From Our Blog</H1>
        <Articles articles={articles} />
      </Section>
      <Section>
        <H1>Get our Product for the Best Price</H1>
        <H2>Contact us for Enterprise plans</H2>
        <Pricetable pricetableItems={pricetable.items} />
      </Section>
    </div>
  )
}

export default connect(async contentful => ({
  pages: await contentful.getEntries({ content_type: 'page' }),
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
  sellPoints: await contentful.getEntries({ content_type: 'sellPoint' }),
  pricetable: await contentful.getEntries({ content_type: 'priceTable', order: 'sys.createdAt' }),
  testimonial: await contentful.getEntries({ content_type: 'testimony' }),
  gallery: await contentful.getEntries({ content_type: 'gallery' }),
}))(About)
