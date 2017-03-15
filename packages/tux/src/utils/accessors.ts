/**
 * Gets the value of a property on an object.
 *
 * @param {Object} obj The value to be clamped
 * @param {String} keyName The lower boundary of the output range
 * @returns {Object} the property value or 'null'.
 */
export function get(obj: any, keyName: string): any {
  if (keyName.length === 0) {
    return obj
  }

  const parts = keyName.split('.')
  const nextLevel = obj[parts[0]]
  const restOfKey = parts.slice(1, parts.length).join('.')
  return get(nextLevel, restOfKey)
}
