import './reset.css'
import './index.css'
import './megadraft.css'
import './megadraft-fixes.css'

export default () => ({
  async createElement(renderChildren) {
    return await renderChildren()
  }
})
