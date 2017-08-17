import React from 'react'
import twitterLogo from './Twitter.svg'
import './styles.css'

const SocialPlug = ({ children }) =>
  <div className="SocialPlug">
    <a
      className="SocialPlug-link"
      href="https://twitter.com/tux"
      rel="noopener"
    >
      <img
        className="SocialPlug-logo"
        src={twitterLogo}
        alt="Follow us on Twitter"
      />
      <p>
        {children}
      </p>
    </a>
  </div>

export default SocialPlug
