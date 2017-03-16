import React from 'react'
import { Editable } from 'tux'
import './styles.css'

const Newsletter = ({ model }) => (
  <div className="Newsletter">
    <div className="Newsletter-register">
      <input type="text" className="Newsletter-registerInput" placeholder="Are you sure?" />
      <button className="Newsletter-registerButton">Sign up</button>
    </div>
    <div className="Newsletter-disclaimer">
      <Editable model={model} field="fields.content.newsletterDisclaimer" />
    </div>
    <div className="Newsletter-social">
      <p className="Newsletter-socialIcon"><span className="icon icon-twitter_circle"></span></p>
      <p className="Newsletter-socialIcon"><span className="icon icon-facebook_circle"></span></p>
      <p className="Newsletter-socialIcon"><span className="icon icon-git_circle"></span></p>
    </div>
  </div>
)

export default Newsletter
