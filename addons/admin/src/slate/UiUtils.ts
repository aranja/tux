import { Value, Block } from 'slate'

export function hasBlock(value: Value, type: string) {
  return value.blocks.some(node => (node ? node.type === type : false))
}

export function hasMark(value: Value, type: string) {
  return value.marks.some(mark => (mark ? mark.type === type : false))
}

export function toggleMark(value: Value, type: string) {
  return value.change().toggleMark(type).value
}

export function toggleBlock(value: Value, type: string) {
  const change = value.change()
  const { document } = value

  // Handle everything but list buttons.
  if (type !== 'bulleted-list' && type !== 'numbered-list') {
    const isActive = hasBlock(value, type)
    const isList = hasBlock(value, 'list-item')

    if (isList) {
      change
        .setBlock(isActive ? 'paragraph' : type)
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list')
    } else {
      change.setBlock(isActive ? 'paragraph' : type)
    }
  } else {
    // Handle the extra wrapping required for list buttons.
    const isList = hasBlock(value, 'list-item')
    const isType = value.blocks.some(block => {
      return block == null
        ? false
        : !!document.getClosest(
            block.key,
            parent => (parent as Block).type === type
          )
    })

    if (isList && isType) {
      change
        .setBlock('paragraph')
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list')
    } else if (isList) {
      change
        .unwrapBlock(
          type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
        )
        .wrapBlock(type)
    } else {
      change.setBlock('list-item').wrapBlock(type)
    }
  }

  return change.value
}
