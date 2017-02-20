import React from 'react'
import classNames from 'classnames'
import Image1 from './Image1.jpg'
import Image2 from './Image2.jpg'
import Image3 from './Image3.jpg'
import './styles.css'

const defaultData = [
  {image: Image1, title: 'Users First', copy: 'Persius laboramus pro in. Mutat harum nam ei. Eam in graeco offendit. Reque saepe nusquam qui ea, ad nonumy causae molestie nam. Alia vocibus invidunt in mea. Sit albucius conclusionemque ea, sea oblique posidonium ad'},
  {image: Image2, title: 'Server Side Rendering', copy: 'Molestiae ratione doloremque nam nostrum temporibus at harum ipsa consequuntur alias dolor. Facere ex ipsam vero ipsa possimus, accusamus debitis perspiciatis eius nam suscipit! Architecto nam tempora omnis quaerat incidunt minus laudantium exercitationem soluta impedit ducimus expedita ipsum cumque, voluptates quas ea?'},
  {image: Image3, title: 'Inline Editing', copy: 'Accusamus modi perferendis iste, labore voluptates ut asperiores voluptatibus qui architecto, soluta. Dolore cumque maiores expedita dignissimos laborum, nemo beatae ipsa rem! Voluptates temporibus modi, quam enim sapiente iste ab quisquam minima nihil, ad officia ea omnis numquam consectetur. Vero architecto, neque! Commodi laborum nobis nesciunt natus mollitia eos ad eum accusamus unde quod esse et pariatur assumenda voluptates.'}
]

class Carousel extends React.Component {

  state = {
    currentIndex: 0
  }

  onDotClick = currentIndex => () => {
    this.setState({ currentIndex })
  }

  render() {
    const { data = defaultData } = this.props

    return (
      <div className="Carousels">
        {data && data.map((data, index) => {
          const isActive = index === this.state.currentIndex

          return (
            <div key={data.title} className={classNames('Carousel', isActive && 'is-active')}>
              <div className="Carousel-body">
                <h1 className="Carousel-title">{data.title}</h1>
                <p className="Carousel-copy">{data.copy}</p>
              </div>
              <div className="Carousel-image" style={{backgroundImage: `url(${data.image})`}}></div>
            </div>
          )
        })}

        <div className="Carousel-indicators" style={{width: `${data.length*1.5}rem`}}>
          {(data && data.map((data, index) => {
            const isActive = index === this.state.currentIndex

            return (
              <div key={index} className={classNames('Carousel-indicator', isActive && 'is-active')} onClick={this.onDotClick(index)}></div>
            )
          }))}
        </div>
      </div>
    )
  }

}

export default Carousel
