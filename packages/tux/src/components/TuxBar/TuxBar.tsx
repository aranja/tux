import React = require('react')

export interface State {
  user : null | {
    name : string
    avatarUrl : string
    spaceName : string
  }
}

class TuxBar extends React.Component<any, State> {
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
    const { user } = this.state
    return (
      <div className="TuxBar">
        <h1 className="TuxBar-title">Tux <small>by <a href="https://aranja.com" target="_blank">Aranja</a></small></h1>
        <div className="TuxBar-right">
          {!user && <button onClick={this.login} className="TuxBar-btn">Sign in</button>}
          {user && (
            <button className="TuxBar-btn">
              <span className="TuxBar-userInfo">
                {user.name}<br />
                <span className="TuxBar-spaceName">{user.spaceName}</span>
              </span>
              <img className="TuxBar-avatar" src={user.avatarUrl} alt={user.name} />
            </button>
          )}
        </div>
        <style jsx>{`
          .TuxBar {
            align-items: center;
            background: linear-gradient(to bottom, #494a4d, #252626);
            background: #292c33;
            box-sizing: border-box;
            display: flex;
            height: 55px;
            left: 0;
            justify-content: space-between;
            padding: 0 1em;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 100;
          }

          .TuxBar-title {
            color: #fff;
            font: 1.4em sans-serif;
            text-transform: uppercase;
          }

          .TuxBar-title small {
            font-size: 0.5em;
            text-transform: none;
          }

          .TuxBar-title a {
            color: inherit;
          }

          .TuxBar-right {
            display: flex;
          }

          .TuxBar-btn {
            align-items: center;
            background: transparent;
            border: 0;
            border-left: 1px solid #40434a;
            color: #fff;
            cursor: pointer;
            display: flex;
            font-size: 1em;
            line-height: 1.4em;
            margin-left: 1em;
            padding: 0;
            padding-left: 1em;
            text-decoration: none;
          }

          .TuxBar-btn:hover {
            color: #ddd;
          }

          .TuxBar-avatar {
            display: inline-block;
            height: 55px;
            margin-left: 1em;
            margin-right: -1em;
            vertical-align: middle;
          }

          .TuxBar-userInfo {
            font-size: 0.8em;
            line-height: 1.2em;
            text-align: right;
          }

          .TuxBar-spaceName {
            color: #62bde3;
            font-size: 0.8em;
          }
        `}</style>
      </div>
    )
  }
}

export default TuxBar
