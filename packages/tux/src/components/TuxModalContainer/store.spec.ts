import { getState, resetState, openModal } from './store'

afterEach(() => {
  resetState()
})

test('has no modals initially', () => {
  const modals = getState()
  expect(modals).toEqual([])
})

test('add a modal', () => {
  const element = 'test'
  openModal(element)

  const state = getState()
  expect(state.length).toBe(1)

  const modal = state[0]
  expect(modal.element).toBe(element)
})

