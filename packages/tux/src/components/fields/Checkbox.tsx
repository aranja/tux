import React from 'react'
import { Theme, input } from '../../colors'

interface Checkbox {
  id: string
  value?: string
  checked: boolean
  label?: string,
  onChange: (value: boolean) => void
}

const Checkbox = ({ id, value, checked, onChange }: Checkbox) => (
  <span>
    <input
      className="Checkbox"
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <div className="CheckboxIndicator"></div>
    <style jsx>{`
      .Checkbox {
        box-sizing: border-box;
        opacity: 0;
        padding: 0;
        position: absolute;
        z-index: -1;
      }

      .CheckboxIndicator {
        background: #FFF;
        border: 1px solid ${input.default.border};
        border-radius: 2px;
        height: 20px;
        left: 0;
        position: absolute;
        top: 2px;
        width: 20px;
      }

      .CheckboxIndicator::after {
        border: solid ${Theme.primary};
        border-width: 0 2px 2px 0;
        content: '';
        height: 10px;
        opacity: 0;
        left: 7px;
        position: absolute;
        top: 3px;
        transform: rotate(45deg) scale(0.5);
        transform-origin: center;
        width: 5px;
      }

      .Checkbox:checked ~ .CheckboxIndicator {
        background: #e5e6ed;
      }

      .Checkbox:checked ~ .CheckboxIndicator::after {
        opacity: 1;
        transform: rotate(45deg) scale(1);
        transition: transform 0.1s cubic-bezier(0.17, 0.67, 0.57, 1.17);
      }
    `}</style>
  </span>
)

export default Checkbox
