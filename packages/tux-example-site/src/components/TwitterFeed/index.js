import React, { Component } from 'react'
import TwitterCard from '../TwitterCard'
import peopleAreSaying from './text'
import './styles.css'

class TwitterFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: null
    }
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
          {peopleAreSaying[Math.floor(Math.random() * peopleAreSaying.length)]}
          </TwitterCard>
        )
      })}
      </div>
    )
  }
}

export default TwitterFeed;
