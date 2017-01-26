import * as React from 'react'

const connect = (fn : Function) => (InnerComponent : React.ComponentClass<any>) => {
  class TuxConnection extends React.Component<any, any> {
    static contextTypes = {
      tux: React.PropTypes.object,
    }

    state = {
      dataProps: {},
    }

    componentDidMount () {
      this.context.tux.adapter.addChangeListener(this.refresh)
      this.refresh()
    }

    refresh = async () => {
      const queryApi = this.context.tux.adapter.getQueryApi()
      const dataProps = await fn(queryApi)
      this.setState({ dataProps })
    }

    render() {
      return <InnerComponent {...this.props} {...this.state.dataProps} refresh={this.refresh} />
    }
  }
  return TuxConnection
}

export default connect
