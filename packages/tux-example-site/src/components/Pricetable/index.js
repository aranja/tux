import React from 'react'
import { Editable } from 'tux'
import './styles.css'

const Pricetable = ({ pricetableItems }) => (
  <div className="Pricetable">
    {pricetableItems && pricetableItems.map((item) => {
      const isFree = item.fields.planPrice === 0
      const price = !isFree ? `$${item.fields.planPrice}` : 'free'

      return (
        <Editable key={item.fields.planName} model={item} className="Pricetable-plan">
          <div>
            <h1 className="Pricetable-planHeading">{item.fields.planName}</h1>
            <div className="Pricetable-planPrice">{price}</div>
            <dl className="Pricetable-planList">
              {item.fields.planListTags && item.fields.planListTags.map((listItem) => (
                <dt key={listItem} className="Pricetable-planListItem">{listItem}</dt>
              ))}
            </dl>
          </div>
          <a href="/" className="Pricetable-button">{isFree ? 'Get started' : 'Purchase'}</a>
        </Editable>
      )
    })}
  </div>
)


export default Pricetable
