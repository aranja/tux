import React from 'react'
import { EditInline } from 'tux'
import './styles.css'

const Newsletter = () => (
  <div className="Newsletter">
    <div className="Newsletter-register">
      <input type="text" className="Newsletter-registerInput" placeholder="Are you sure?" />
      <button className="Newsletter-registerButton">Sign up</button>
    </div>
    <div className="Newsletter-disclaimer">
      <EditInline field="fields.content.newsletterDisclaimer" />
    </div>
    <div className="Newsletter-social">
      <p className="Newsletter-socialIcon"><span className="icon icon-twitter_circle" /></p>
      <p className="Newsletter-socialIcon"><span className="icon icon-facebook_circle" /></p>
      <p className="Newsletter-socialIcon"><span className="icon icon-git_circle" /></p>
    </div>
  </div>
)

export default Newsletter
