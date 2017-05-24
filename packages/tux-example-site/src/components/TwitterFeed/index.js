import React, { Component } from 'react'
import TwitterCard from '../TwitterCard'
import peopleAreSaying from './text'
import users from './users'
import './styles.css'

class TwitterFeed extends Component {
  render() {
    return (
      <div className="TwitterFeed">
      {users && users.map((user, i) => {
        return (
          <TwitterCard
            key={i}
            name={`${user.name.first} ${user.name.last}`}
            handle={user.login.username}
            image={user.picture.thumbnail}
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
