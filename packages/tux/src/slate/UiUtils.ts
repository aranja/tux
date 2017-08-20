import { Block, State } from 'slate'

export function hasBlock(state: State, type: string) {
  return state.blocks.some(node => (node ? node.type === type : false))
}

export function hasMark(state: State, type: string) {
  return state.marks.some(mark => (mark ? mark.type === type : false))
}

export function toggleMark(state: State, type: string) {
  return state.transform().toggleMark(type).apply()
}

export function toggleBlock(state: State, type: string) {
  const transform = state.transform()
  const { document } = state

  // Handle everything but list buttons.
  if (type !== 'bulleted-list' && type !== 'numbered-list') {
    const isActive = hasBlock(state, type)
    const isList = hasBlock(state, 'list-item')

    if (isList) {
      transform
        .setBlock(isActive ? 'paragraph' : type)
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list')
    } else {
      transform.setBlock(isActive ? 'paragraph' : type)
    }
  } else {
    // Handle the extra wrapping required for list buttons.
    const isList = hasBlock(state, 'list-item')
    const isType = state.blocks.some(block => {
      return block == null
        ? false
        : !!document.getClosest(
            block.key,
            parent => (parent as Block).type === type
          )
    })

    if (isList && isType) {
      transform
        .setBlock('paragraph')
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list')
    } else if (isList) {
      transform
        .unwrapBlock(
          type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
        )
        .wrapBlock(type)
    } else {
      transform.setBlock('list-item').wrapBlock(type)
    }
  }

  return transform.apply()
}
