import Adapter from './Adapter'

interface TuxContext {
  isEditing: boolean
  editModel: (model: any) => Promise<boolean>
  adapter: Adapter
}

export default TuxContext
