import React from 'react'
import classNames from 'classnames'
import { lighten, fade } from '../../utils/color'
import { tuxColors } from '../../styles'

export interface State {
  user: null | {
    name: string
    avatarUrl: string
    spaceName: string
  },
  isVisible: boolean
}

class TuxSidebar extends React.Component<any, State> {
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

    return (
      <div className={classNames('TuxSidebar', isVisible && 'is-visible', overlayIsActive && 'has-overlay')}>
        <div className="TuxSidebar-trigger" onClick={this.handleVisibility}>{isVisible ? '×' : 'Tux'}</div>
        <ul className="TuxSidebar-content">
          <div className="TuxSidebar-logo">Tux</div>
          <li>
            <button className={classNames('TuxSidebar-editButton', isEditing && 'is-active')} onClick={onClickEdit}>{isEditing ? 'Editing: on' : 'Editing: off'}</button>
          </li>
          <li><a href="/">Documentation</a></li>
          <li><a href="/">Tux on Github</a></li>
        </ul>
        {user && (
          <div className="TuxSidebar-user">
            <a onClick={this.login} className="TuxSidebar-signInOut">{user ? 'Sign out' : 'Sign in'}</a>
          </div>
        )}

        <style jsx>{`
          .TuxSidebar {
            background: ${tuxColors.colorSnow};
            box-sizing: border-box;
            position: fixed;
            width: 100%;
            max-width: 260px;
            right: 0;
            height: 100%;
            min-height: 100vh;
            z-index: 100;
            box-shadow: 7px 1px 10px ${fade(tuxColors.colorBlack, 0.2)};
            transform: translateX(100%);
            transition: transform 0.4s ease-out;
            will-change: transform;
          }

          .TuxSidebar.is-visible {
            transform: none;
          }

          /* When we open a *modal* for editing, we animate the sidebar out. */
          .TuxSidebar.is-visible.has-overlay {
            transform: translateX(100%);
          }

          .TuxSidebar-trigger {
            background: ${lighten(tuxColors.colorPurple, 0.2)};
            border-radius: 0;
            box-shadow: 0px 0 10px ${fade(tuxColors.colorBlack, 0.25)};
            color: ${tuxColors.textLight};
            cursor: pointer;
            height: 30px;
            left: -65px;
            line-height: 30px;
            position: absolute;
            text-align: center;
            bottom: 135px;
            transform: rotateZ(-90deg);
            width: 100px;
            z-index: 101;
          }

          /*Sneak peak on hover*/
          .TuxSidebar:hover:not(.is-visible) {
            transform: translateX(100%);
          }

          .TuxSidebar-content {
            display: block;
            position: relative;
            flex: 0 1 100%;
            padding: 10px;
            padding-right: 20px;
          }

          .TuxSidebar-content li {
            color: ${tuxColors.textGray};
            display: block;
            font-size: 16px;
            margin: 10px 15px;
            padding: 10px 15px;
          }

          .TuxSidebar-content li a {
            text-decoration: none;
          }

          .TuxSidebar-logo {
            font-size: 24px;
            padding: 10px;
            text-align: center;
            font-size: 24px;
            border-bottom: 1px solid ${fade(tuxColors.colorBlack, 0.05)};
            margin-bottom: 10px;
          }

          .TuxSidebar-editButton {
            appearance: none;
            background: ${tuxColors.colorPurple};
            border: none;
            box-shadow: 0 12px 20px -10px ${fade(tuxColors.colorPurple, 0.2)}, 0 4px 20px 0px ${fade(tuxColors.colorBlack, 0.2)}, 0 7px 8px -5px ${fade(tuxColors.colorPurple, 0.2)};
            color: ${tuxColors.textLight};
            cursor: pointer;
            display: block;
            font-size: 16px;
            padding: 15px;
            width: 100%;
          }

          .TuxSidebar-editButton:hover {
            background: ${lighten(tuxColors.colorPurple, 0.1)};
          }

          .TuxSidebar-editButton.is-active {
            background: ${tuxColors.colorPink};
            box-shadow: 0px 0px 3px 2px ${fade(tuxColors.colorPink, 0.25)};
          }

          .TuxSidebar-user {
            bottom: 25px;
            left: 0; right: 0;
            margin: auto;
            position: absolute;
          }

          .TuxSidebar-signInOut {
            opacity: 0.85;
            cursor: pointer;
            color: ${tuxColors.textGray};
            display: block;
            text-decoration: none;
            text-align: center;
            text-shadow: 0 1px 0 ${fade(tuxColors.textLight, 0.4)};
          }

          .TuxSidebar-signInOut:hover {
            color: ${tuxColors.colorPink};
          }

        `}</style>
      </div>
    )
  }
}

export default TuxSidebar
