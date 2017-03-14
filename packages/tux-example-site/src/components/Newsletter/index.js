import React from 'react'
import './styles.css'

const Newsletter = ({}) => (
  <div className="Newsletter">
    <div className="Newsletter-register">
      <input type="text" className="Newsletter-registerInput" placeholder="Are you sure?" />
      <button className="Newsletter-registerButton">Sign up</button>
    </div>
    <div className="Newsletter-disclaimer">
      <p>We send out cat facts 8 times a week. At least.</p>
      <p>Unregister at any time by adopting a cat.</p>
    </div>
    <div className="Newsletter-social">
      <p className="Newsletter-socialIcon"><span className="icon icon-twitter_circle"></span></p>
      <p className="Newsletter-socialIcon"><span className="icon icon-facebook_circle"></span></p>
      <p className="Newsletter-socialIcon"><span className="icon icon-git_circle"></span></p>
    </div>
  </div>
)

export default Newsletter
