import React from 'react'
import Portal from 'react-portal'
import FaBold from 'react-icons/lib/fa/bold'
import FaItalic from 'react-icons/lib/fa/italic'
import FaCode from 'react-icons/lib/fa/code'
import FaUnderline from 'react-icons/lib/fa/underline'

class HoverPortal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: null
    }
  }

  hasMark = type => {
    const { editorState } = this.props
    return editorState.marks.some(mark => mark.type === type)
  }

  renderMarkButton(type, icon) {
    const { onClickMark } = this.props
    const isActive = this.hasMark(type)
    const onMouseDown = e => onClickMark(e, type)

    return (
      <span
        className="HoverPortal-button"
        onMouseDown={onMouseDown}
        data-active={isActive}
      >
        {icon}
        <style jsx>{`
        .HoverPortal-button {
          color: #fff;
          display: flex;
          margin: 4px;
          width: 12px;
          opacity: 0.8;
        }

        .HoverPortal-button[data-active="true"] {
          opacity: 1;
        }
      `}</style>
      </span>
    )
  }

  onOpen = portal => {
    this.setState({ menu: portal })
  }

  updateMenu = () => {
    const { menu } = this.state
    const { editorState } = this.props
    if (!menu) return

    const tmp = menu.firstChild || menu 

    if (editorState.isBlurred || editorState.isEmpty) {
      tmp.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    tmp.style.opacity = 1
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
        <div className="HoverPortal">
          {this.renderMarkButton('bold', <FaBold />)}
          {this.renderMarkButton('italic', <FaItalic />)}
          {this.renderMarkButton('underlined', <FaUnderline />)}
          {this.renderMarkButton('code', <FaCode />)}
        </div>
        <style jsx>{`
          .HoverPortal {
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
            transition: opacity .75s;
          }
        `}</style>
      </Portal>
    )
  }
}

export default HoverPortal