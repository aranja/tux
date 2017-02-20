import React from 'react'
import { Editable, connect } from 'tux'
import { H1 } from './components/typography'
import Banner from './components/Banner'
import FeaturedIn from './components/FeaturedIn'
import SellPoints from './components/SellPoints'

import './App.css'

const App = ({ articles }) => (
  <div className="App">
    <Banner color={"#473bb1"} />
    <section>
      <H1>The Main Features</H1>
      <SellPoints />
    </section>
    {/* <FeaturedIn /> */}
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
