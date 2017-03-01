import { timeSince } from './time'

test('Convert a date', () => {
  const timeNow = new Date()
  expect(timeSince(timeNow)).toEqual('0 seconds')
})

test('Return a string when handed a timedate format string', () => {
  const stringToCheck = '2017-02-20T22:41:14.565Z'
  expect(typeof(timeSince(new Date(stringToCheck)))).toBe('string')
  expect(timeSince(new Date(stringToCheck))).not.toBe('NaN seconds')
})

test('Return a string when handed a readable date string', () => {
  const stringToCheck = 'March 1, 2017 22:41:14'
  expect(typeof(timeSince(new Date(stringToCheck)))).toBe('string')
  expect(timeSince(new Date(stringToCheck))).not.toBe('NaN seconds')
})

test('Return the string "NaN seconds" when handed a unsupported string', () => {
  const stringToCheck = 'Hey Siri, what time is it?'
  expect(timeSince(new Date(stringToCheck))).toBe('NaN seconds')
})
