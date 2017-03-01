import { timeSince } from './time'

// afterEach(() => {
//
// })

test('Convert a date', () => {
  const time = new Date()
  expect(timeSince(time)).toEqual('0 seconds')
})

test('Return a string when handed a timedate format string', () => {
  const string = '2017-02-20T22:41:14.565Z'
  expect(typeof(timeSince(new Date(string)))).toBe('string')
  expect(typeof(timeSince(new Date(string)))).not.toBe('NaN seconds')
})

test('Return a string when handed a readable date string', () => {
  const string = 'March 1, 2017 22:41:14'
  expect(typeof(timeSince(new Date(string)))).toBe('string')
  expect(typeof(timeSince(new Date(string)))).not.toBe('NaN seconds')
})

test('Return the string "NaN seconds" when handed a unsupported string', () => {
  const string = 'Hey Siri, what time is it?'
  expect(timeSince(new Date(string))).toBe('NaN seconds')
})
