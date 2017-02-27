import React from 'react'
import { Editable } from 'tux'
import './styles.css'

const Testimonial = ({ testimonial }) => (
  <div>
    {testimonial && testimonial.map((testimony) => (
      <Editable key={testimony.fields.attestantName} model={testimony}>
        <div className="Testimonial">
          <div className="Testimonial-quote">
            <p className="Testimonial-quoteText">{testimony.fields.quote}</p>
            <p className="Testimonial-quoteAuthor">
              {`${testimony.fields.attestantName}, ${testimony.fields.attestantTitle}`}
            </p>
          </div>
          <div className="Testimonial-image" style={{backgroundImage: `url('${testimony.fields.attestantImage.asset.file.url}')`}}></div>
        </div>
      </Editable>
    ))}
  </div>
)

export default Testimonial
