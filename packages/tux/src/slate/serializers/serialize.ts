import { Plain, Raw, State } from 'slate'
import { Html } from './Html'
import { Format } from './Format'

function serialize(state: State, format: Format = 'raw'): any {
  switch (format) {
    case 'raw':
      return Raw.serialize(state, { terse: true })
    case 'html':
      return Html.serialize(state)
    case 'plain':
      return Plain.serialize(state)
    default:
      throw new Error(`Don't know how to deserialize ${format}`)
  }
}

export default serialize
