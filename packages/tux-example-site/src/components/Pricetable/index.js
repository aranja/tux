import React from 'react'
import './styles.css'

const defaultData = [
  { planName: 'Free plan', planCost: 'free', planPerks: ['Self-hosted', 'Server-side Rendering', 'Contenful Adapter'], buttonText: 'Get started'  },
  { planName: 'Individual plan', planCost: '$9', planPerks: ['Self-hosted', 'Server-side Rendering', 'All available CMS adapters', 'Middleman caching'] },
  { planName: 'Professional plan', planCost: '$99', planPerks: ['Self-hosted', 'Server-side Rendering', 'Contenful Adapter', 'All Available CMS adapters', 'Middleman caching', 'Support'] }
]

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
