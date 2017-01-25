// State.
let state = []
let onChangeListener = null
let counter = 0

/**
 * Gets the current stack of open modals.
 */
export function getState() {
  return state
}

/**
 * Removes a modal from the state.
 */
function removeModal(modalToRemove) {
  state = state.filter(modal => modal !== modalToRemove)
  if (onChangeListener) {
    onChangeListener()
  }
}

/**
 * Opens a modal.
 */
export function openModal(element) {
  return new Promise((resolve, reject) => {
    const id = counter++
    const modal = {
      element,
      id,
      onClose: result => {
        removeModal(modal)
        resolve(result)
      },
    }
    state = state.concat([modal])

    if (onChangeListener) {
      onChangeListener()
    }
  })
}

/**
 * Registers a modal stack listener. This is a singleton as the
 * modals should only be rendered in one place.
 */
export function setListener(handler) {
  onChangeListener = handler

  // Dispose function
  return () => {
    if (onChangeListener === handler) {
      onChangeListener = null
    }
  }
}
