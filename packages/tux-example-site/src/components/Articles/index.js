import React from 'react'

import './styles.css'

const Article = ({ articleItems }) => (
  <article className="Article">
    <h1 className="Article-heading">Lorem Ipsum Dolor Sit Is A Boring Headline</h1>
    <p className="Article-meta">Written by <a href="#" className="Article-metaAuthor">Johnny Bravo</a>, 3 days ago</p>
    <div className="Article-column">
      <p className="Article-text">
        But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?
      </p>
      <p className="Article-text">
On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish.</p>
    </div>
    <a href="#" className="Article-more">
      <span className="Article-moreText">Read More</span>
    </a>
  </article>
)

export default Article
