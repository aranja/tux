import React from 'react'
import image1 from './Image1.jpg'
import './styles.css'

const defaultData = [
  { authorName: 'Eirikur Nilsson', authorWorkplace: 'Aranja', authorImage: image1, quote: 'Et vivendo comprehensam eam, dicam impetus et pertinax et vel, fugit set  persius dissentiunt eum et. Sed summo' }
]

const Testimonial = ({ data = defaultData }) => (
  <div>
    {data.map((testimonial) => (
      <div key={testimonial.authorName} className="Testimonial">
        <div className="Testimonial-quote">
          <p className="Testimonial-quoteText">{testimonial.quote}</p>
          <p className="Testimonial-quoteAuthor">{`${testimonial.authorName}, ${testimonial.authorWorkplace}`}</p>
        </div>
        <div className="Testimonial-image" style={{backgroundImage: `url('${testimonial.authorImage}')`}}></div>
      </div>
    ))}
  </div>
)

export default Testimonial
