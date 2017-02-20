import React from 'react'
import { Editable, connect } from 'tux'
import './App.css'

const App = ({ articles }) => (
  <div className="App">
    {articles && articles.items.map(article => (
      <Editable key={article.id} model={article}>
        <h1>{article.fields.title}</h1>
        <p className="App-articleText">{article.fields.text}</p>
      </Editable>
    ))}
  </div>
)//

export default connect(async contentful => ({
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
}))(App)
