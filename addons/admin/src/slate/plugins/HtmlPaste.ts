import { Plugin } from 'slate'
import { Html } from '../serializers/Html'

/**
 * Paste handler.
 */
function HtmlPaste(): Plugin {
  return {
    onPaste: (event, data, state) => {
      if (data.type !== 'html') {
        return
      }
      if (data.isShift) {
        return
      }

      const { document } = Html.deserialize(data.html)
      return state
        .transform()
        .insertFragment(document)
        .apply()
    },
  }
}

export default HtmlPaste
