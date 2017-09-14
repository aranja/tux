import React, { Component } from 'react'
import classNames from 'classnames'
import { Theme } from '../../theme'

class AlertBar extends Component<any, any> {
  hideDelay = 1500

  state = {
    isHidden: false,
  }

  private timer: any

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        isHidden: true
      })
    }, this.hideDelay)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const { isHidden } = this.state

    return (
      <div className={classNames('AlertBar', isHidden && 'is-hidden' )}>
        <p className="AlertBar-text">
          You are in edit mode. Any changes you make will be published.
        </p>
        <style jsx>{`
          .AlertBar {
            background: ${Theme.alert};
            bottom: 0;
            left: 0;
            color: #FFF;
            display: flex;
            justify-content: center;
            padding: 5px;
            position: fixed;
            text-align: center;
            transform: 0;
            transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
            font-size: 14px;
            width: 100%;
            will-change: transform;
            z-index: 1000000;
          }
          .AlertBar.is-hidden {
            transform: translateY(80%);
            transition-duration: 0.15s;
          }
          .ALertBar.is-hidden:hover {
            transform: translateY(0);
            transition-duration: 0.40s;
          }
          .AlertBar-text {
            cursor: default;
          }
        `}</style>
      </div>
    )
  }

}

export default AlertBar
