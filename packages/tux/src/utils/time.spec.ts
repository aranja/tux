import { timeSince } from './time'

test('Convert a date', () => {
  const timeNow = new Date()
  expect(timeSince(timeNow)).toEqual('0 seconds')
})

test('Return a string when handed a datetime format string', () => {
  const dateTime = '2017-02-20T22:41:14.565Z'
  expect(typeof(timeSince(new Date(dateTime)))).toBe('string')
  expect(timeSince(new Date(dateTime))).not.toBe('NaN seconds')
})

test('Return a string when handed a readable date string', () => {
  const readableDate = 'March 1, 2017 22:41:14'
  expect(typeof(timeSince(new Date(readableDate)))).toBe('string')
  expect(timeSince(new Date(readableDate))).not.toBe('NaN seconds')
})

test('Throw an error when handed an invalid input', () => {
  const invalidInput = 'Hey Siri, what time is it?'
  expect(timeSince(new Date(invalidInput))).toThrowError('Invalid input.')
})
