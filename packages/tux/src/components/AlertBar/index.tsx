import React from 'react'
import classNames from 'classnames'
import { tuxColors } from '../../styles'

const AlertBar = ({ isActive }) => (
  <div className={classNames('AlertBar', isActive && 'is-active')}>
    <p>You are in edit mode. Any changes you make will be published.</p>
    <style jsx>{`
      .AlertBar {
        background: ${tuxColors.colorPink};
        color: #FFF;
        display: none;
        justify-content: center;
        padding: 5px;
        position: fixed;
        text-align: center;
        top: 0;
        width: 100%;
        z-index: 50;
      }
      .AlertBar.is-active {
        display: flex;
      }
      `}</style>
  </div>
)

export default AlertBar
