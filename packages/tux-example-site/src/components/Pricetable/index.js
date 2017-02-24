import React from 'react'
import './styles.css'

const Pricetable = ({ pricetableItems }) => (
  <div className="Pricetable">
    {pricetableItems && pricetableItems.map((item) => {
      const isFree = item.fields.planPrice === 0
      const price = !isFree ? `$${item.fields.planPrice}` : 'free'

      return (
        <div key={item.fields.planName} className="Pricetable-plan">
          <div>
            <h1 className="Pricetable-planHeading">{item.fields.planName}</h1>
            <div className="Pricetable-planPrice">{price}</div>
            <dl className="Pricetable-planList">
              {item.fields.planList && item.fields.planList.split(', ').map((listItem) => (
                <dt key={listItem} className="Pricetable-planListItem">{listItem}</dt>
              ))}
            </dl>
          </div>
          <a href="/" className="Pricetable-button">{isFree ? 'Get started' : 'Purchase'}</a>
        </div>
      )
    })}
  </div>
)


export default Pricetable
