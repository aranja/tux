import { Value, State } from 'slate'
import Plain from 'slate-plain-serializer'
import { Html } from './Html'
import { Format } from './Format'

function deserialize(value: any, format: Format = 'raw'): State | null {
  // Don't try to deserialize null.
  if (value == null) {
    return null
  }

  // Always handle raw values.
  // Make it easier to migrate between raw and html.
  if (typeof value === 'object' && value.nodes) {
    return Value.fromJSON(value)
  }

  if (typeof value !== 'string') {
    return null
  }

  switch (format) {
    case 'plain':
      return Plain.deserialize(value)
    // If value is string and format raw,
    case 'raw':
    case 'html':
      return Html.deserialize(value)
    default:
      throw new Error(`Don't know how to deserialize ${format}`)
  }
}

export default deserialize
