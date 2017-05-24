import React from 'react'
import Home from './Home'
import About from './About'

// The top-level (parent) route
export default [
  {
    path: '/',
    async action({ context: { api } }) {
      const [
        pages,
        sellPoints,
        pricetable,
        testimonial,
        carousel
      ] = await Promise.all([
        api.getEntries({ content_type: 'page' }),
        api.getEntries({ content_type: 'sellPoint' }),
        api.getEntries({ content_type: 'priceTable', order: 'sys.createdAt' }),
        api.getEntries({ content_type: 'testimony' }),
        api.getEntries({ content_type: 'carousel' }),
      ])

      const content = pages.items.find(page => page.sys.id === '3yu5uaHcisCiKgKU84oWei')

      return (
        <Home
          content={content}
          sellPoints={sellPoints}
          pricetable={pricetable}
          testimonial={testimonial}
          carousel={carousel}
        />
      )
    }
  },
  {
    path: '/about',
    async action({ context: { api } }) {
      const [
        pages,
        sellPoints,
        gallery,
        testimonial,
        pricetable,
        articles,
      ] = await Promise.all([
        api.getEntries({ content_type: 'page' }),
        api.getEntries({ content_type: 'sellPoint' }),
        api.getEntries({ content_type: 'gallery' }),
        api.getEntries({ content_type: 'testimony' }),
        api.getEntries({ content_type: 'priceTable', order: 'sys.createdAt' }),
        api.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
      ])

      const content = pages.items.find(page => page.sys.id === '1EKFlARWuoSCkiI6gamwc4')

      return (
        <About
          content={content}
          sellPoints={sellPoints}
          gallery={gallery}
          testimonial={testimonial}
          pricetable={pricetable}
          articles={articles}
        />
      )
    }
  },
  {
    path: '/*',
    action() {
      return <h1>404 Not Found</h1>
    }
  },
]
