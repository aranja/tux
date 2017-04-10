import Adapter from './Adapter'

interface TuxContext {
  isEditing: boolean,
  editModel: (model: any) => boolean
  adapter: Adapter
}

export default TuxContext
