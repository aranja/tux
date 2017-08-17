import React from 'react'
import { EditModal } from 'tux'
import './styles.css'

const Testimonial = ({ testimonial }) => (
  <div>
    {testimonial && testimonial.map((testimony) => (
      <EditModal key={testimony.fields.attestantName} model={testimony}>
        <div className="Testimonial">
          <div className="Testimonial-quote">
            <p className="Testimonial-quoteText">{testimony.fields.quote}</p>
            <p className="Testimonial-quoteAuthor">
              {`${testimony.fields.attestantName}, ${testimony.fields.attestantTitle}`}
            </p>
          </div>
          <div className="Testimonial-image" style={{backgroundImage: `url('${testimony.fields.attestantImage.fields.file.url}')`}}></div>
        </div>
      </EditModal>
    ))}
  </div>
)

export default Testimonial
