import React from 'react'
import { EditModal } from 'tux'

import './styles.css'

const SellPoints = ({ sellPoints }) => (
  <div className="SellPoints">
    {sellPoints && sellPoints.slice(0, 3).map((point, index) => (
      <div key={index} className="SellPoint">
        <EditModal model={point}>
          {point.fields.icon.asset && (
            <img className="SellPoint-icon" src={`${point.fields.icon.asset.file.url}?w=256`} alt={point.fields.icon.title}/>
          )}
          <h1 className="SellPoint-title">{point.fields.title}</h1>
          <p className="SellPoint-copy">{point.fields.text}</p>
        </EditModal>
      </div>
    ))}
  </div>
)

export default SellPoints
