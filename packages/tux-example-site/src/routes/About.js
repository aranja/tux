import React from 'react'
import { Editable, connect } from 'tux'
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


const About = ({ pages, articles, sellPoints, gallery, testimonial, pricetable }) => {

  if (!pages) return null
  const page = pages.items[0]

  return (
    <div className="p-About">
      <Menu />
      <ProductBanner image={ProductBannerImage} heading="You make the website, we'll handle the content" text="Hand-crafted with so much love that you have no idea. In recusandae cum vero at commodi, ad tempore molestiae. Autem repellat adipisci aperiam atque tenetur accusamus, ipsa sit amet, consectetur adipisicing elit." />
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

export default connect(async contentful => ({
  pages: await contentful.getEntries({ content_type: 'page' }),
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
  sellPoints: await contentful.getEntries({ content_type: 'sellPoint' }),
  pricetable: await contentful.getEntries({ content_type: 'priceTable', order: 'sys.createdAt' }),
  testimonial: await contentful.getEntries({ content_type: 'testimony' }),
  gallery: await contentful.getEntries({ content_type: 'gallery' }),
}))(About)
