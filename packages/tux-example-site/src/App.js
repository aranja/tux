import React from 'react'
import { Editable, connect } from 'tux'
import { H1 } from './components/typography'
import Banner from './components/Banner'
import FeaturedIn from './components/FeaturedIn'
import Section from './components/Section'
import SellPoints from './components/SellPoints'
import Carousel from './components/Carousel'
import Testimonial from './components/Testimonial'
import Gallery from './components/Gallery'

import './reset.css'
import './App.css'

const App = ({ articles }) => (
  <div className="App">
    <Banner color={"#473bb1"} />
    <Section>
      <H1>The Main Features</H1>
      <SellPoints />
    </Section>
    <Section>
      <Carousel />
    </Section>
    <Section>
      <Testimonial />
    </Section>
    <Section>
      <H1>Who is using Tux</H1>
      <Gallery />
    </Section>
    {articles && articles.items.map(article => (
      <Editable key={article.id} model={article}>
        <h1>{article.fields.title}</h1>
        <p className="App-articleText">{article.fields.text}</p>
      </Editable>
    ))}
  </div>
)

export default connect(async contentful => ({
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
}))(App)
