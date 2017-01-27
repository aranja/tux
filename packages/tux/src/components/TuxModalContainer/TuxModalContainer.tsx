import * as React from 'react'
import * as classNames from 'classnames'
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import toggleScroll from './toggle-scroll'
import { getState, setListener } from './store'

class ModalContainer extends React.Component<any, any> {
  private listener : () => any

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

  onClickBackdrop = (event : React.MouseEvent<any>) => {
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
        <style jsx>{`
          .ModalContainer {
            position: relative;
            z-index: 10;
          }

          .ModalContainer-overlay {
            background: rgba(0, 0, 0, 0.5);
            height: 100%;
            left: 0;
            opacity: 0;
            position: fixed;
            top: 0;
            transition: opacity 0.3s, visibility 0.3s 0.3s;
            visibility: hidden;
            width: 100%;
          }

          .ModalContainer-overlay.is-active {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
          }

          .ModalContainer-scroll {
            height: 100%;
            left: 0;
            -webkit-overflow-scrolling: touch;
            overflow-y: scroll;
            position: fixed;
            top: 0;
            width: 100%;
          }

          .ModalContainer-modal {
            align-items: center;
            display: flex;
            justify-content: center;
            min-height: 100vh;
          }

          .ModalTransition-enter {
            opacity: 0;
            transform: translateY(15%);
            transition: opacity 0.3s, transform 0.3s;
          }

          .ModalTransition-enter-active {
            opacity: 1;
            transform: none;
          }

          .ModalTransition-leave {
            overflow: hidden;
          }

          .ModalTransition-leave-active {
            opacity: 0;
            transform: translateY(15%);
            transition: opacity 0.3s, transform 0.3s;
          }
        `}</style>
      </div>
    )
  }
}

export default ModalContainer
