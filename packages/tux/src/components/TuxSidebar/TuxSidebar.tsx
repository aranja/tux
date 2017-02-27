import React = require('react')
import classNames = require('classnames')

export interface State {
  user : null | {
    name : string
    avatarUrl : string
    spaceName : string
  }
}

class TuxSidebar extends React.Component<any, State> {
  static contextTypes = {
    tux: React.PropTypes.object,
  }

  state : State = {
    user: null,

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
    const { isEditing, onClickEdit } = this.props
    const { user } = this.state
    return (
      <div className="TuxSidebar">
        <div className="TuxSidebar-content">
          <div className="TuxSidebar-logo">Tux</div>
          <button className={classNames('TuxSidebar-editButton', isEditing && 'is-active')} onClick={onClickEdit}>{isEditing ? 'Done' : 'Edit'}</button>
        </div>
        {!user && <button onClick={this.login} className="TuxSidebar-btn">Sign in</button>}
        {user && (
          <div className="TuxSidebar-user">
            <div className="TuxSidebar-userAvatar" style={{backgroundImage: `url(${user.avatarUrl})`}}>
              <p className="TuxSidebar-userInfo">
                Hello, {user.name}
              </p>
            </div>
          </div>
        )}
        <style jsx>{`
          .TuxSidebar {
            display: flex;
            flex-direction: column;
            background: #FFF;
            box-sizing: border-box;
            position: fixed;
            width: 100%;
            max-width: 100px;
            height: 100%;
            min-height: 100vh;
            z-index: 100;
            box-shadow: 7px 1px 10px rgba(0, 0, 0, 0.2);
          }
          .TuxSidebar-userAvatar {
            padding-top: 100%;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .TuxSidebar-content {
            position: relative;
            flex: 0 1 100%;
            padding: 10px;
          }
          .TuxSidebar-user {
            flex: 0 1 128px;
            max-height: 128px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            width: 100%;
          }
          .TuxSidebar-userInfo {
            color: white;
            background: #e8008a;
            text-align: center;
          }
          .TuxSidebar-logo {
            font-size: 24px;
            padding: 10px;
            text-align: center;
          }
          .TuxSidebar-editButton {
            appearance: none;
            background: rgb(71, 59, 177);
            border: none;
            color: white;
            display: block;
            font-size: 14px;
            padding: 10px;
            width: 100%;
          }
          .TuxSidebar-editButton.is-active {
            background: #e8008a;
            box-shadow: 0px 0px 3px 2px rgba(232, 0, 138, 0.25);
          }
        `}</style>
      </div>
    )
  }
}

export default TuxSidebar
