import Helmet from 'react-helmet'

const helmet = () => session => {
  session.on('server', render => {
    render()
    const data = Helmet.renderStatic()
    session.helmet = data

    Object.assign(session.htmlProps, data.htmlAttributes.toComponent())
    Object.assign(session.bodyProps, data.bodyAttributes.toComponent())
    session.head.push(
      ...data.title.toComponent(),
      ...data.meta.toComponent(),
      ...data.link.toComponent(),
      ...data.style.toComponent(),
      ...data.noscript.toComponent(),
      ...data.script.toComponent()
    )
  })
}

export default helmet
