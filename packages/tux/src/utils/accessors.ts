/**
 * Gets the value of a property on an object.
 *
 * @param {Object} obj The value to be clamped
 * @param {String} keyName The lower boundary of the output range
 * @returns {Object} the property value or 'null'.
 */
export function get(obj: any, keyName: string) {
  return obj[keyName]
}
