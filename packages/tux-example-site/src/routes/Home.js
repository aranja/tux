import React from 'react'
import { Editable, connect } from 'tux'
import { H1, H2 } from '../components/typography'
import ProductBanner from '../components/ProductBanner'
import Menu from '../components/Menu'
import Section from '../components/Section'
import SellPoints from '../components/SellPoints'
import SocialPlug from '../components/SocialPlug'
import Carousel from '../components/Carousel'
import Testimonial from '../components/Testimonial'
import TwitterFeed from '../components/TwitterFeed'
import Pricetable from '../components/Pricetable'

import ProductBannerImage from '../ProductBannerImage.png'

const Home = ({ pages, articles, sellPoints, pricetable, testimonial, gallery, carousel }) => {

  if (!pages) return null
  const page = pages.items[0]

  return (
    <div className="p-Home">
      <Menu />
      <ProductBanner image={ProductBannerImage} heading="You make the website, we'll handle the content" text="Hand-crafted with so much love that you have no idea. In recusandae cum vero at commodi, ad tempore molestiae. Autem repellat adipisci aperiam atque tenetur accusamus, ipsa sit amet, consectetur adipisicing elit." />
      <Section>
        <H1><Editable model={page} field="fields.content.tagline" /></H1>
        <SellPoints sellPoints={sellPoints.items} />
      </Section>
      <Section>
        <Carousel carouselItems={carousel.items}/>
      </Section>
      <Section>
        <Testimonial testimonial={testimonial.items}/>
      </Section>
      <Section backgroundColor="#F5F7FA">
        <H1>What People Say About Tux</H1>
        <H2>Totally random and unbiased selection of people</H2>
        <TwitterFeed />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
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
  carousel: await contentful.getEntries({ content_type: 'carousel' }),
}))(Home)
