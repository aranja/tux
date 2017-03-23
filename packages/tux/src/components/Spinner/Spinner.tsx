import React from 'react'
import { Theme, input } from '../../theme'
import { fade } from '../../utils/color'

const Spinner = () => (
  <div className="Spinner">
    <style jsx>{`
      .Spinner {
        animation: pulse 0.75s infinite;
        animation-delay: 0.25s;
        background: ${fade(Theme.primary, 0.2)};
        height: 36px;
        margin: auto;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        width: 8px;
      }
      .Spinner::before,
      .Spinner::after {
        animation: pulse 0.75s infinite;
        background: ${fade(Theme.primary, 0.2)};
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
          background: ${fade(Theme.primary, 0.7)};
        }
      }
    `}</style>
  </div>
)

export default Spinner
