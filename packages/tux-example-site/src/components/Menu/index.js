import React from 'react'
import Logo from '../Logo'

import './styles.css'

const menuItems = ['About', 'Works', 'Experience', 'Try out Tux']

const Menu = () => (
  <div className="Menu">
    <Logo />
    <ul className="Menu-list">
      {menuItems.map((item) => (
        <li key={item} className="Menu-item">{item}</li>
      ))}
    </ul>
  </div>
)

export default Menu
