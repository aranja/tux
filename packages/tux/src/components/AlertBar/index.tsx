import React from 'react'
import classNames from 'classnames'
import { tuxColors } from '../../styles'

const AlertBar = () => (
  <div className="AlertBar">
    <p>You are in edit mode. Any changes you make will be published.</p>
    <style jsx>{`
      .AlertBar {
        background: ${tuxColors.colorPink};
        color: #FFF;
        display: flex;
        justify-content: center;
        padding: 5px;
        position: fixed;
        text-align: center;
        bottom: 0;
        width: 100%;
        z-index: 50;
      }
    `}</style>
  </div>
)

export default AlertBar
