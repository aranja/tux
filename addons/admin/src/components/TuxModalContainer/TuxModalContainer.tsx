import React from 'react'
import classNames from 'classnames'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import toggleScroll from './toggle-scroll'
import { getState, setListener, State as StoreState, Modal } from './store'
import { decelerationCurve, sharpCurve } from '../../utils/curves'

export interface State {
  modals: StoreState
}

export class ModalContainer extends React.Component<any, State> {
  private listener: () => any

  state = {
    modals: getState(),
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
        <div
          className={classNames(
            'ModalContainer-overlay',
            hasModals && 'is-active'
          )}
        />

        <TransitionGroup>
          {modals.map(({ element, id, onClose }) => (
            <CSSTransition key={id} timeout={500} classNames="fade">
              <div className="ModalContainer-scroll">
                <div
                  className="ModalContainer-modal"
                  onClick={this.onClickBackdrop}
                >
                  {React.cloneElement(element, { onClose })}
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
        <style jsx>{`
          .ModalContainer {
            position: relative;
            z-index: 1000000;
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
            transition: opacity 1s cubic-bezier(0.11, 0.37, 0.83, 0.99);
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

          .fade-enter {
            transform: translateX(100%);
          }

          .fade-enter-active {
            transform: translateX(0);
            transition: transform 450ms cubic-bezier(${decelerationCurve});
          }

          .fade-exit {
            overflow: hidden;
          }

          .fade-exit-active {
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(${sharpCurve});
          }
        `}</style>
      </div>
    )
  }
}

export default ModalContainer
