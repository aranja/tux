import React from 'react'
import moment from 'moment'
import { EditModal } from 'tux-addon-admin'

import './styles.css'

const Article = ({ articles }) => {
  const latest = articles.items[0]
  const timeAgo = latest.sys.createdAt

  return (
    <article className="Article">
      <EditModal model={latest}>
        <h1 className="Article-heading">{latest.fields.title}</h1>
        <p className="Article-meta">
          Written by{' '}
          <a href="#" className="Article-metaAuthor">
            Johnny Bravo
          </a>, {moment(timeAgo).fromNow()}
        </p>
        <div className="Article-column">
          <p className="Article-text">{latest.fields.text}</p>
        </div>
        <a href="#" className="Article-more">
          <span className="Article-moreText">Read More</span>
        </a>
      </EditModal>
    </article>
  )
}

export default Article
