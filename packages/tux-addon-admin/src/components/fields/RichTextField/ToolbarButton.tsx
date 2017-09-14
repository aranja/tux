import React, { ReactNode } from 'react'

export interface Props {
  isActive: boolean
  icon: ReactNode
  onClick: (type: string) => void
  type: string
}

const ToolbarButton = ({ isActive, icon, onClick, type }: Props) =>
  <button
    className="Toolbar-button"
    onMouseDown={event => {
      event.preventDefault()
      onClick(type)
    }}
    role="presentation"
    tabIndex={-1}
    type="button"
    aria-pressed={isActive}
  >
    {icon}
    <style jsx>{`
      .Toolbar-button {
        background: transparent;
        border: 0;
        margin: 4px;
        margin-left: 12px;
        width: 12px;
        opacity: 0.5;
      }

      .Toolbar-button:first-child {
        margin-left: 6px;
      }

      .Toolbar-button[data-active="true"] {
        opacity: 1;
      }
    `}</style>
  </button>

export default ToolbarButton
