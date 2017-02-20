import React from 'react'
import { EditableList, connect } from 'tux'
import './App.css'

const App = ({ articles }) => (
  <div className="App">
    {articles && (
      <EditableList list={articles.items}>
        {article => (
          <div key={article.sys.id}>
            <h1>{article.fields.title}</h1>
            <p className="App-articleText">{article.fields.text}</p>
          </div>
        )}
      </EditableList>
    )}
  </div>
)//

export default connect(async contentful => ({
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
}))(App)
