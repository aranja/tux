import React from 'react'

import './styles.css'

const Article = ({ articleItems }) => (
  <article className="Article">
    <h1 className="Article-heading">Lorem Ipsum Dolor Sit Is A Boring Headline</h1>
    <p className="Article-meta">Written by <span className="Article-metaAuthor">Johnny Bravo</span>, 3 days ago</p>
    <p className="Article-text">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati autem, incidunt vero vitae mollitia a, ex at. Tenetur iste cum ducimus quae neque dolorem magnam fugit dignissimos ipsa cumque, similique inventore! Repellat iste quia quae accusamus tenetur, autem odit molestias debitis in quibusdam asperiores quas amet. Vel eos consequuntur sequi, illum repellat excepturi quibusdam atque reprehenderit omnis consectetur nesciunt iure deleniti laborum voluptates voluptatum nam deserunt dolorem saepe quasi repellendus, ipsum. Harum qui numquam ea suscipit consequuntur modi reiciendis, a optio fuga illum! Id magni deserunt ab perspiciatis et consectetur aspernatur! Dolores tempora neque iste!
    </p>
    <p className="Article-more">
      Read More
    </p>
  </article>
)

export default Article
