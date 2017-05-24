import React from 'react'
import { EditModal } from 'tux'
import classNames from 'classnames'

import './styles.css'

class Carousel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0,
    }
  }

  onDotClick(currentIndex) {
    this.setState({ currentIndex })
  }

  render() {
    const { carouselItems } = this.props

    return (
      <div className="Carousel">
        {carouselItems && carouselItems.map((item, index) => {
          const isActive = index === this.state.currentIndex

          return (
            <EditModal
              className={classNames('Carousel-item', isActive && 'is-active')}
              key={item.fields.title}
              model={item}
            >
              <div className="Carousel-itemImage" style={{backgroundImage: `url(${item.fields.image.asset.file.url})`}}></div>
              <div className="Carousel-itemBody">
                <h1 className="Carousel-itemTitle">{item.fields.title}</h1>
                <p className="Carousel-itemCopy">{item.fields.text}</p>
              </div>
            </EditModal>
          )
        })}

        <div className="Carousel-indicator" style={{width: `${carouselItems && carouselItems.length*1.5}rem`}}>
          {(carouselItems && carouselItems.map((item, index) => {
            const isActive = index === this.state.currentIndex
            return (
              <div
                key={index}
                className={classNames('Carousel-indicatorDot', isActive && 'is-active')}
                onClick={() => this.onDotClick(index)}
              />
            )
          }))}
        </div>
      </div>
    )
  }

}

export default Carousel
