import React from 'react'
import { Editable } from 'tux'
import Helmet from 'react-helmet'
import { H1, H2 } from '../components/typography'
import Pricetable from '../components/Pricetable'
import Menu from '../components/Menu'
import Articles from '../components/Articles'
import Gallery from '../components/Gallery'
import ProductBanner from '../components/ProductBanner'
import Section from '../components/Section'
import SocialPlug from '../components/SocialPlug'

import ProductBannerImage from '../ProductBannerImage.png'

const About = ({ pages, sellPoints, gallery, testimonial, pricetable, articles }) => {
  const page = pages.items[0]

  return (
    <div className="p-About">
      <Helmet
        title="About - Tux Demo Site"
      />
      <Menu />
      <ProductBanner image={ProductBannerImage}>
        <div className="ProductBanner-heading"><Editable model={page} field="fields.content.title2" /></div>
        <div className="ProductBanner-text"><Editable model={page} field="fields.content.subtitle2" /></div>
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
        <H1><Editable model={page} field="fields.content.pricetableTitle" /></H1>
        <H2><Editable model={page} field="fields.content.pricetableSubtitle" /></H2>
        <Pricetable pricetableItems={pricetable.items} />
      </Section>
    </div>
  )
}

export default About
