import React from 'react'

import icon1 from './Icon1.svg'
import icon2 from './Icon2.svg'
import icon3 from './Icon3.svg'

import './styles.css'

const defaultSellPoints = [
  {icon: icon1, title: 'Users First', copy: 'Doctus temporibus ius no, nec tollit conceptam definiebas te. Alii appetere dissentias. Doctus temporibus'},
  {icon: icon2, title: 'Server Side Rendering', copy: 'Vel et munere expetenda honestatis. Ex sonet audiam Vel et munere expetenda honestatis. Ex sonet audiam set amet'},
  {icon: icon3, title: 'Inline Editing', copy: 'DGraeco aperiri nec no. Mea iusto detraxit an. Essent patrioque id. Graeco aperiri nec no. At ancillae dissentias eos'}
]

const SellPoints = ({ points = defaultSellPoints }) => (
  <div className="SellPoints">
    {points.length && points.length >= 3 && points.map((point, index) => (
        <div key={index} className="SellPoint">
          <img className="SellPoint-icon" src={point.icon} alt={point.title}/>
          <h1 className="SellPoint-title">{point.title}</h1>
          <p className="SellPoint-copy">{point.copy}</p>
        </div>
    ))}
  </div>
)

export default SellPoints
