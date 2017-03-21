import React from 'react'
import { Editable, EditInline } from 'tux'
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

const Home = ({ content, sellPoints, testimonial, carousel }) => (
  <div className="p-Home">
    <Helmet
      title="Tux Demo Site"
    />
    <Menu />
    <Editable model={content}>
      <ProductBanner image={ProductBannerImage} />
      <Section>
        <H1><EditInline field="fields.content.tagline" /></H1>
        <SellPoints sellPoints={sellPoints.items} />
      </Section>
      <Section>
        <Carousel carouselItems={carousel.items}/>
      </Section>
      <Section>
        <Testimonial testimonial={testimonial.items}/>
      </Section>
      <Section backgroundColor="#F5F7FA">
        <H1><EditInline field="fields.content.twitterFeedTitle" /></H1>
        <H2><EditInline field="fields.content.twitterFeedSubtitle" /></H2>
        <TwitterFeed />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
      </Section>
      <Section>
        <H1><EditInline field="fields.content.newsletterTitle" /></H1>
        <H2><EditInline field="fields.content.newsletterSubtitle" /></H2>
        <Newsletter model={content} />
      </Section>
    </Editable>
  </div>
)

export default Home
