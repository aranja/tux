import React, { Component } from 'react'
import { Theme, input } from '../../colors'
import { fade } from '../../utils/color'

class Spinner extends Component<any, any> {

  static contextTypes = {
    tux: React.PropTypes.object,
  }

  theme = this.context.tux.theme

  render() {
    return (
      <div className="Spinner">
        <style jsx>{`
          .Spinner {
            animation: pulse 0.75s infinite
            animation-delay: 0.25s;
            background: ${this.theme.spinner.colorFrom};
            height: 36px;
            margin: auto;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            width: 8px;
          }
          .Spinner::before,
          .Spinner::after {
            animation: pulse 0.75s infinite;
            background: ${this.theme.spinner.colorFrom};
            content: '';
            display: block;
            height: 24px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
          }
          .Spinner::before {
            left: -16px;
          }
          .Spinner::after {
            left: 16px;
            animation-delay: 0.5s;
          }

          @keyframes pulse {
            50% {
              background: ${this.theme.spinner.colorTo};
            }
          }
        `}</style>
      </div>
    )
  }

}

export default Spinner
