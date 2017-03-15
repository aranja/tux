/**
 * Gets the value of a property on an object.
 *
 * @param {Object} obj The value to be clamped
 * @param {String} key The lower boundary of the output range
 * @returns {Object} the property value or 'null'.
 */
export function get(obj: any, key: string | string[]): any {
  if (key.length === 0 || !obj) {
    return obj ? obj : null
  }

  const parts = _splitKey(key)
  const nextLevel = obj[parts[0]]
  const restOfKey = parts.slice(1, parts.length).join('.')
  return get(nextLevel, restOfKey)
}

function _splitKey(key: string | string[]) {
  if (key instanceof Array) {
    return key
  }
  return key.split('.')
}
