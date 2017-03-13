import React from 'react'
import { Editable } from 'tux'
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

const Home = ({ pages, sellPoints, pricetable, testimonial, carousel }) => {
  const page = pages.items[0]

  return (
    <div className="p-Home">
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
        <Carousel carouselItems={carousel.items}/>
      </Section>
      <Section>
        <Testimonial testimonial={testimonial.items}/>
      </Section>
      <Section backgroundColor="#F5F7FA">
        <H1>BLABLA People Say About Tux</H1>
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

export default Home
