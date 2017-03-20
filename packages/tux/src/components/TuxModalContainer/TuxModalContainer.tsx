import React from 'react'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import toggleScroll from './toggle-scroll'
import { getState, setListener, State as StoreState, Modal } from './store'

export interface State {
  modals: StoreState,
}

export class ModalContainer extends React.Component<any, State> {
  private listener: () => any

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

  onClickBackdrop = (event: React.MouseEvent<any>) => {
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
          transitionEnterTimeout={400}
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
            z-index: 101;
          }

          .ModalContainer-overlay {
            background: rgba(0, 0, 0, 0.5);
            height: 100%;
            left: 0;
            opacity: 0;
            position: fixed;
            top: 0;
            transition: opacity 0.3s, visibility 0 0.3s;
            visibility: hidden;
            width: 100%;
          }

          .ModalContainer-overlay.is-active {
            opacity: 1;
            transition-delay: 0s;
            visibility: visible;
            transition: opacity 1s cubic-bezier(.11,.37,.83,.99);
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
            height: 100%;
            min-height: 100vh;
          }

          .ModalTransition-enter {
            opacity: 0;
            transform: translateX(100%);
          }

          .ModalTransition-enter-active {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 0.2s ease-in, transform 0.4s cubic-bezier(.11,.37,.83,.99);
          }

          .ModalTransition-leave {
            overflow: hidden;
          }

          .ModalTransition-leave-active {
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s, transform 0.3s ease-in-out;
          }
        `}</style>
      </div>
    )
  }
}

export default ModalContainer
