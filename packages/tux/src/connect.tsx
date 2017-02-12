import React = require('react')

export interface RefreshProp {
  refresh : () => Promise<void>,
}

interface State<DataProps> {
  dataProps : null | DataProps,
}

type InnerProps<OuterProps, DataProps> = OuterProps & DataProps & RefreshProp

function connect<DataProps>(fn : (api : any) => Promise<DataProps>) {
  return function wrap<OuterProps>(InnerComponent : React.ComponentClass<InnerProps<OuterProps, DataProps>>) : React.ComponentClass<OuterProps> {
    class TuxConnection extends React.Component<OuterProps, State<DataProps>> {
      static contextTypes = {
        tux: React.PropTypes.object,
      }

      state = {
        dataProps: null,
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
        const props = {} as InnerProps<OuterProps, DataProps>;
        Object.assign(props, this.props, this.state.dataProps, { refresh: this.refresh });
        return React.createElement(InnerComponent, props);
      }
    }
    return TuxConnection
  }
}

export default connect
