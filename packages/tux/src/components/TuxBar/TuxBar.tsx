import React, { Component, PropTypes } from 'react'

interface State {
  user ?: {
    name: string
    avatarUrl: string
    spaceName: string
  }
}

class TuxBar extends Component<any, State> {
  static contextTypes = {
    tux: PropTypes.object,
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
      </div>
    )
  }
}

export default TuxBar
