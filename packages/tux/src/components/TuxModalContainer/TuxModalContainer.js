import React, { Component } from 'react'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import toggleScroll from './toggle-scroll'
import { getState, setListener } from './store'

class ModalContainer extends Component {
  state = {
    modals: getState()
  }

  componentDidUpdate() {
    this.toggleScroll()
  }

  componentDidMount() {
    this.listener = setListener(this.onModalsChange)

    this.toggleScroll()
  }

  componentWillUnmount() {
    this.listener()
  }

  toggleScroll() {
    const hasModals = this.state.modals.length > 0
    toggleScroll(!hasModals)
  }

  onModalsChange = () => {
    this.setState({ modals: getState() })
  }

  onClickBackdrop = (event) => {
    if (event.target !== event.currentTarget) {
      return
    }

    const { modals } = this.state
    const lastModal = modals[modals.length - 1]
    lastModal.onClose()
  }

  render() {
    const { modals } = this.state
    const hasModals = modals.length > 0

    return (
      <div className="ModalContainer">
        <div className={classNames('ModalContainer-overlay', hasModals && 'is-active')} />

        <ReactCSSTransitionGroup
          transitionName="ModalTransition"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {modals.map(({ element, id, onClose }) =>
            <div className="ModalContainer-scroll" key={id}>
              <div className="ModalContainer-modal" onClick={this.onClickBackdrop}>
                {React.cloneElement(element, { onClose })}
              </div>
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default ModalContainer
