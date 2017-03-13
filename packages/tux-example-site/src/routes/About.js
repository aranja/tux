import React from 'react'
import { Editable } from 'tux'
import { H1, H2 } from '../components/typography'
import Pricetable from '../components/Pricetable'
import Menu from '../components/Menu'
import SellPoints from '../components/SellPoints'
import Gallery from '../components/Gallery'
import ProductBanner from '../components/ProductBanner'
import Section from '../components/Section'
import SocialPlug from '../components/SocialPlug'
import Testimonial from '../components/Testimonial'

import ProductBannerImage from '../ProductBannerImage.png'


const About = ({ pages, sellPoints, gallery, testimonial, pricetable }) => {
  const page = pages.items[0]

  return (
    <div className="p-About">
      <Menu />
      <ProductBanner image={ProductBannerImage}>
        <div className="ProductBanner-heading"><Editable model={page} field="fields.content.title" /></div>
        <div className="ProductBanner-text"><Editable model={page} field="fields.content.subtitle" /></div>
      </ProductBanner>
      <Section>
        <H1><Editable model={page} field="fields.content.tagline" /></H1>
        <SellPoints sellPoints={sellPoints.items} />
      </Section>
      <Section>
        <H1>Who is using Tux</H1>
        <Gallery galleryItems={gallery.items} />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
      </Section>
      <Section>
        <Testimonial testimonial={testimonial.items}/>
      </Section>
      <Section>
        <H1>Get our Product for the Best Price</H1>
        <H2>Contact us for Enterprise plans</H2>
        <Pricetable pricetableItems={pricetable.items} />
      </Section>
    </div>
  )
}

export default About
