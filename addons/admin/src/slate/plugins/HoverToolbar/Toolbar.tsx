import React, { ReactElement } from 'react'
import Portal from 'react-portal'
import FaBold from 'react-icons/lib/fa/bold'
import FaItalic from 'react-icons/lib/fa/italic'
import FaCode from 'react-icons/lib/fa/code'
import FaUnderline from 'react-icons/lib/fa/underline'
import { Value } from 'slate'
import { hasMark, toggleMark } from '../../UiUtils'

export interface Props {
  onChange(value: Value): void
  value: Value
}

export interface State {
  menu: HTMLElement | null
}

class Toolbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      menu: null,
    } as State
  }

  renderMarkButton(type: string, icon: ReactElement<any>) {
    const { value, onChange } = this.props
    const isActive = hasMark(value, type)

    return (
      <button
        className="Toolbar-button"
        onMouseDown={e => {
          e.preventDefault()
          onChange(toggleMark(value, type))
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
            color: #fff;
            margin: 4px;
            opacity: 0.8;
          }

          .Toolbar-button[aria-pressed='true'] {
            opacity: 1;
          }
        `}</style>
      </button>
    )
  }

  onOpen = (portal: HTMLElement) => {
    this.setState({ menu: portal })
  }

  updateMenu = () => {
    const { menu } = this.state
    const { value } = this.props
    if (!menu) {
      return
    }

    const tmp = menu.firstChild || menu
    if (!(tmp instanceof HTMLElement)) {
      return
    }

    if (value.isBlurred || value.isEmpty) {
      tmp.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    tmp.style.opacity = '1'
    tmp.style.top = `${rect.top + window.scrollY - tmp.offsetHeight}px`
    tmp.style.left = `${rect.left +
      window.scrollX -
      tmp.offsetWidth / 2 +
      rect.width / 2}px`
  }

  componentDidMount() {
    this.updateMenu()
  }

  componentDidUpdate() {
    this.updateMenu()
  }

  render() {
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="Toolbar">
          {this.renderMarkButton('bold', <FaBold />)}
          {this.renderMarkButton('italic', <FaItalic />)}
          {this.renderMarkButton('underlined', <FaUnderline />)}
          {this.renderMarkButton('code', <FaCode />)}
          <style jsx>{`
            .Toolbar {
              padding: 8px 7px 6px;
              position: absolute;
              display: flex;
              z-index: 1;
              top: -10000px;
              left: -10000px;
              margin-top: -6px;
              opacity: 0;
              background-color: #222;
              border-radius: 4px;
              transition: opacity 0.75s;
            }
          `}</style>
        </div>
      </Portal>
    )
  }
}

export default Toolbar
