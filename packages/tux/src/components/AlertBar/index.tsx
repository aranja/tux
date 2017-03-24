import React, { Component } from 'react'
import classNames from 'classnames'

class AlertBar extends Component<any, any> {

  constructor(props: any, context: any) {
    super(props, context)
    this.theme = this.context.tux.theme.alertBar
    this.hideDelay = 1500
  }

  private theme: any
  private hideDelay: Number
  private timer: any

  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state = {
    isHidden: false,
  }


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
            background: ${this.theme.backgroundColor};
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
            z-index: 50;
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
