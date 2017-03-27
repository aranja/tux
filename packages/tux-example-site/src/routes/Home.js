import React from 'react'
import { Editable, ModelCreator } from 'tux'
import Helmet from 'react-helmet'
import { H1, H2 } from '../components/typography'
import ProductBanner from '../components/ProductBanner'
import Menu from '../components/Menu'
import Section from '../components/Section'
import SellPoints from '../components/SellPoints'
import SocialPlug from '../components/SocialPlug'
import Carousel from '../components/Carousel'
import Testimonial from '../components/Testimonial'
import TwitterFeed from '../components/TwitterFeed'
import Newsletter from '../components/Newsletter'
import Pricetable from '../components/Pricetable'

import ProductBannerImage from '../ProductBannerImage.png'

const Home = ({ pages, sellPoints, testimonial, carousel }) => {

  const page = pages.items[0]

  return (
    <div className="p-Home">
      <Helmet
        title="Tux Demo Site"
      />
      <Menu />
      <ProductBanner image={ProductBannerImage}>
        <div className="ProductBanner-heading"><Editable model={page} field="fields.content.title" /></div>
        <div className="ProductBanner-text"><Editable model={page} field="fields.content.subtitle" /></div>
      </ProductBanner>
      <Section>
        <H1><Editable model={page} field="fields.content.tagline" /></H1>
        <SellPoints sellPoints={sellPoints.items} />
        <ModelCreator model="sellPoint" />
      </Section>
      <Section>
        <Carousel carouselItems={carousel.items}/>
      </Section>
      <Section>
        <Testimonial testimonial={testimonial.items}/>
      </Section>
      <Section backgroundColor="#F5F7FA">
        <H1><Editable model={page} field="fields.content.twitterFeedTitle" /></H1>
        <H2><Editable model={page} field="fields.content.twitterFeedSubtitle" /></H2>
        <TwitterFeed />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
      </Section>
      <Section>
        <H1><Editable model={page} field="fields.content.newsletterTitle" /></H1>
        <H2><Editable model={page} field="fields.content.newsletterSubtitle" /></H2>
        <Newsletter model={page} />
      </Section>
    </div>
  )
}

export default Home
