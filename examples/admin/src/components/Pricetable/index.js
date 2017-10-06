import React from 'react'
import { EditModal } from 'tux-addon-admin'
import './styles.css'

const Pricetable = ({ pricetableItems }) => (
  <div className="Pricetable">
    {pricetableItems &&
      pricetableItems.map(item => {
        const isFree = item.fields.planPrice === 0
        const price = !isFree ? `$${item.fields.planPrice}` : 'free'

        return (
          <div key={item.fields.planName} className="Pricetable-plan">
            <EditModal model={item}>
              <h1 className="Pricetable-planHeading">{item.fields.planName}</h1>
              <div className="Pricetable-planPrice">{price}</div>
              <dl className="Pricetable-planList">
                {item.fields.planListTags &&
                  item.fields.planListTags.map(listItem => (
                    <dt key={listItem} className="Pricetable-planListItem">
                      {listItem}
                    </dt>
                  ))}
              </dl>
            </EditModal>
            <a href="/" className="Pricetable-button">
              {isFree ? 'Get started' : 'Purchase'}
            </a>
          </div>
        )
      })}
  </div>
)

export default Pricetable
