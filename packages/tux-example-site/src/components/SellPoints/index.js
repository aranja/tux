import React from 'react'
import { Editable } from 'tux'

import './styles.css'

const SellPoints = ({ sellPoints }) => (
  <div className="SellPoints">
    {sellPoints && sellPoints.slice(0, 3).map((point, index) => (
      <Editable key={index} model={point}>
        <div className="SellPoint">
          <img className="SellPoint-icon" src={point.fields.icon.fields.file.url} alt={point.fields.icon.fields.title}/>
          <h1 className="SellPoint-title">{point.fields.title}</h1>
          <p className="SellPoint-copy">{point.fields.text}</p>
        </div>
      </Editable>
    ))}
  </div>
)

export default SellPoints
