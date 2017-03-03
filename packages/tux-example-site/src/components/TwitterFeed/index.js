import React, { Component } from 'react'
import TwitterCard from '../TwitterCard'
import './styles.css'

class TwitterFeed extends Component {
  state = {
    users: null
  }

  async componentDidMount() {
    const responses = await Promise.all([
      fetch('https://randomuser.me/api/'),
      fetch('https://randomuser.me/api/'),
      fetch('https://randomuser.me/api/'),
      fetch('https://randomuser.me/api/'),
      fetch('https://randomuser.me/api/'),
      fetch('https://randomuser.me/api/')
    ])

    this.setState({
      users: await Promise.all(responses.map(response => response.json()))
    })
  }

  render() {
    const { users } = this.state
    return (
      <div className="TwitterFeed">
      {users && users.map((user, i) => {
        const demoUser = user.results[0]
        return (
          <TwitterCard
            key={i}
            name={`${demoUser.name.first} ${demoUser.name.last}`}
            handle={demoUser.login.username}
            image={demoUser.picture.thumbnail}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis hic, molestiae accusamus laboriosam! Optio, suscipit!
          </TwitterCard>
        )
      })}
      </div>
    )
  }
}

export default TwitterFeed;
