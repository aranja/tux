import React from 'react'
import classNames from 'classnames'
import { lighten, fade } from '../../utils/color'
import { tuxColors } from '../../colors'

export interface State {
  user: null | {
    name: string
    avatarUrl: string
    spaceName: string
  },
  isVisible: boolean
}
const TuxFabColor = '#3a82df';
const TuxFabActiveColor = '#f11b9e';
const TuxFabAnimationDelay = 0.12;

class TuxFab extends React.Component<any, State> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state: State = {
    user: null,
    isVisible: false,
  }

  handleVisibility = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible
    })
  }

  async componentDidMount() {
    const user = await this.context.tux.adapter.currentUser()

    if (user) {
      this.setState({
        user: {
          name: user.firstName,
          avatarUrl: user.avatarUrl,
          spaceName: user.space.name,
        }
      })
    }
  }

  login = () => {
    this.context.tux.adapter.login()
  }

  render() {
    const { isEditing, overlayIsActive, onClickEdit } = this.props
    const { user, isVisible } = this.state
    const classes = classNames('TuxFab', {
      'is-active': isEditing,
      'is-visible': isVisible,
      'has-overlay': overlayIsActive,
    })
    const activeClassName = 'icon icon-plus'
    const inActiveClassName = 'icon icon-plus'
    return (
      <div className={classes}>
          <a
            className={classNames('TuxFab-item TuxFab-mainItem', isEditing && 'is-active')}
            onClick={onClickEdit}>
              <i className={isEditing ? activeClassName : inActiveClassName}></i>
          </a>
          <a className="TuxFab-item" href="/"><i className="icon icon-white_question"></i></a>
          <a className="TuxFab-item" href="/"><i className="icon icon-git"></i></a>
          <a
            onClick={this.login}
            className="TuxFab-item TuxFab-signInOut">
            <i className="icon icon-user"></i>
          </a>

        <style jsx>{`
          .TuxFab {
            align-items: center;
            bottom: 40px;
            cursor: pointer;
            overflow: visible;
            position: fixed;
            right: 40px;
            display: flex;
            flex-direction: column;
          }

          .TuxFab-item {
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${TuxFabColor};
            text-decoration: none;
            background: #fdfdfd;
            border-radius: 50%;
            height: 45px;
            flex: none;
            position: relative;
            width: 45px;
            order: 0;
            margin-top: 10px;
            transition: opacity 0.2s ease, transform 0.4s cubic-bezier(0,.62,.45,1.13);
            transition-origin: center;
          }
          .TuxFab-item:hover {
            background: #FFF;
          }
          .TuxFab-item::after {
            border-radius: 50%;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1), 0 3px 12px rgba(0, 0, 0, 0.05);
            content: '';
            display: block;
            height: 100%;
            left: 0;
            transform-origin: center;
            border: 1px solid rgba(0, 0, 0, 0.05);
            position: absolute;
            top: 0;
            width: 100%;
            z-index: -1;
          }
          .TuxFab-mainItem {
            background-color: ${TuxFabColor};
            transform: scale(0.9);
            transition: transform 0.25s cubic-bezier(0,.62,.45,1.13), background-color 0.15s;
            color: white;
            order: 1;
            width: 65px;
            height: 65px;
          }
          .TuxFab-mainItem .icon {
            font-size: 20px;
            transition: transform 0.15s cubic-bezier(0,.62,.45,1.13);
          }
          .TuxFab:hover .TuxFab-mainItem {
            transform: scale(1);
            background-color: ${lighten(TuxFabColor, 0.1)};
          }
          .TuxFab.is-active .TuxFab-mainItem {
            background: ${TuxFabActiveColor};
          }
          .TuxFab-item:not(:first-child) {
            opacity: 0;
          }
          .TuxFab-item:nth-child(2) {
            transform: translateY(20px) scale(0.8);
            transition-delay: ${TuxFabAnimationDelay}s;
          }
          .TuxFab-item:nth-child(3) {
            transform: translateY(15px) scale(0.8);
            transition-delay: ${TuxFabAnimationDelay / 2}s;
          }
          .TuxFab-item:nth-child(4) {
            transform: translateY(10px) scale(0.8);
            transition-delay: 0s;
          }

          .TuxFab:hover .TuxFab-item:not(:first-child) {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          .TuxFab.is-visible {

          }

          /* When we open a *modal* for editing, we animate the sidebar out. */
          .TuxFab.is-visible.has-overlay {

          }
        `}</style>
      </div>
    )
  }
}

export default TuxFab
