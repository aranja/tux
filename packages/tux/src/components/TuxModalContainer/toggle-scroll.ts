const defaultClassName = 'u-noScroll'

/**
 * Calculate the width of sidebars and optionally set a margin-right ruleset.
 * @param {String} selector - What selector to bind to
 * @param {String?} mediaQuery
 * @returns {number} - Width of the sidebar
 */
export function calculateScrollbarWidth({ className = defaultClassName } = {}) {
  function calculateWidth() {
    // Temporary div to measure widths
    const scroll = document.createElement('div')
    const css = 'height: 50px; left: -50px; overflow: scroll; position: fixed; top: -50px; width: 50px;'
    scroll.setAttribute('style', css)
    document.body.appendChild(scroll)

    // Determine a scrollbar's width.
    const width = scroll.offsetWidth - scroll.clientWidth

    // Remove dom node
    document.body.removeChild(scroll)

    // Return the width
    return width
  }

  function setCssRuleset(sidebarWidth: number) {
    const style = document.createElement('style')
    let ruleset = `.${className} { margin-right: ${sidebarWidth}px; overflow: hidden; }`
    style.innerText = ruleset
    document.head.appendChild(style)
  }

  const width = calculateWidth()

  if (typeof className === 'string') {
    setCssRuleset(width)
  }

  return width
}

/**
 * Toggles scrolling, avoiding layout jump from scrollbar width.
 *
 * @param shouldScroll optional boolean to toggle to a specific state.
 * @param element to toggle scrolling on. Defaults to the html element.
 * @param className used to toggle scrolling. Defaults to .u-noScroll
 */
export default function toggleScroll(
  shouldScroll?: boolean,
  element?: HTMLElement,
  className: string = defaultClassName
) {
  if (typeof document === 'undefined') {
    throw new Error('Should not toggle scrolling on the server. Use componentDidMount instead.')
  }

  const scrollElement = element || document.documentElement

  // Don't count on toggle's second parameter. Thanks IE.
  if (shouldScroll != null) {
    const doesScroll = !scrollElement.classList.contains(className)
    if (doesScroll === shouldScroll) {
      return
    }
  }
  scrollElement.classList.toggle(className)
}

if (process.env.BROWSER !== false) {
  // calculateScrollbarWidth()
}
