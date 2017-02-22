import React from 'react'
import './styles.css'

const defaultData = [
  { planName: 'Free plan', planCost: 'free', planPerks: ['Self-hosted', 'Server-side Rendering', 'Contenful Adapter'], buttonText: 'Get started'  },
  { planName: 'Individual plan', planCost: '$9', planPerks: ['Self-hosted', 'Server-side Rendering', 'All available CMS adapters', 'Middleman caching'] },
  { planName: 'Professional plan', planCost: '$99', planPerks: ['Self-hosted', 'Server-side Rendering', 'Contenful Adapter', 'All Available CMS adapters', 'Middleman caching', 'Support'] }
]

const Pricetable = ({ data = defaultData }) => (
  <div className="Pricetable">
    {data && data.map((data) => (
      <div key={data.planName} className="Pricetable-plan">
        <div>
          <h1 className="Pricetable-planHeading">{data.planName}</h1>
          <div className="Pricetable-planPrice">{data.planCost}</div>
          <dl className="Pricetable-planList">
            {data.planPerks && data.planPerks.map((perk) => (
              <dt key={perk} className="Pricetable-planListItem">{perk}</dt>
            ))}
          </dl>
        </div>
        <a href="/" className="Pricetable-button">{data.buttonText || 'Purchase'}</a>
      </div>
    ))}
  </div>
)

export default Pricetable
