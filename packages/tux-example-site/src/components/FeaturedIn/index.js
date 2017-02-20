import React from 'react'
import './styles.css'

import githubLogo from './github.svg'
import aranjaLogo from './aranja.svg'
import jsconfisLogo from './jsconfis.svg'
import reactLogo from './react.svg'

const defaultCompanies = [
  {name: 'Github', logo: githubLogo, url: 'https://github.com'},
  {name: 'Aranja', logo: aranjaLogo, url: 'https://aranja.com'},
  {name: 'JSConf Iceland', logo: jsconfisLogo, url: 'https://jsconf.is'},
  {name: 'React', logo: reactLogo, url: 'https://facebook.github.io/react/'}
]

const FeaturedIn = ({ companies = defaultCompanies }) => (
  <div className="FeaturedIn">
    {companies.map((company) => (
      <div key={company.name} className="FeaturedIn-logo">
        <a href={company.url} rel="noopener" target="_blank">
          <img src={company.logo} alt={company.name}/>
        </a>
      </div>
    ))}
  </div>
)

export default FeaturedIn
