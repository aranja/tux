import React from 'react'
import { Editable } from 'tux'

import './styles.css'

const SellPoints = ({ sellPoints }) => (
  <div className="SellPoints">
    {sellPoints && sellPoints.slice(0, 3).map((point, index) => (
      <Editable key={index} model={point} className="SellPoint">
        {point.fields.icon.asset && (
          <img className="SellPoint-icon" src={point.fields.icon.asset.file.url} alt={point.fields.icon.title}/>
        )}
        <h1 className="SellPoint-title">{point.fields.title}</h1>
        <p className="SellPoint-copy">{point.fields.text}</p>
      </Editable>
    ))}
  </div>
)

export default SellPoints
