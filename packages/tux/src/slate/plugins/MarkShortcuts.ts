import { Plugin } from 'slate'
import { toggleMark } from '../UiUtils'

/**
 * On key down, if it's a formatting command toggle a mark.
 */
function MarkShortcuts(): Plugin {
  return {
    onKeyDown: (event, data, state) => {
      if (!data.isMod) return
      let mark

      switch (data.key) {
        case 'b':
          mark = 'bold'
          break
        case 'i':
          mark = 'italic'
          break
        case 'u':
          mark = 'underlined'
          break
        default:
          return
      }

      event.preventDefault()
      return toggleMark(state, mark)
    },
  }
}

export default MarkShortcuts
