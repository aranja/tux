import React from 'react'
import classNames from 'classnames'
import Link from '../Link'
import Logo from '../Logo'

import './styles.css'

const menuItems = [{name: 'Home', href: '/'}, {name: 'About', href: '/about'}, {name: 'Try out Tux', href: '/'}]

const Menu = ({ theme = 'dark' }) => (
  <div className={classNames('Menu', theme === 'light' && 'Menu--light')}>
    <Logo />
    <ul className="Menu-list">
      {menuItems.map((item) => (
        <li key={item.name} className="Menu-item">
          <Link href={item.href}>{item.name}</Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Menu
