import { Html as HtmlSerializer } from 'slate'

/**
 * Tags to blocks.
 */
const BLOCK_TAGS: { [key: string]: string } = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six'
}

/**
 * Tags to marks.
 */
const MARK_TAGS: { [key: string]: string } = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code'
}

/**
 * Serializer rules.
 */
const RULES: HtmlSerializer.Rule[] = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!block) return
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes)
      }
    }
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()]
      if (!mark) return
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.childNodes)
      }
    }
  },
  {
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'pre') return
      const code = el.childNodes[0] as HTMLElement | undefined
      const childNodes = code && code.tagName.toLowerCase() === 'code'
        ? code.childNodes
        : el.childNodes

      return {
        kind: 'block',
        type: 'code',
        nodes: next(childNodes)
      }
    }
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'a') return
      return {
        kind: 'inline',
        type: 'link',
        nodes: next(el.childNodes),
        data: {
          href: el.getAttribute('href'),
        }
      }
    }
  }
]

/**
 * Create a new HTML serializer with `RULES`.
 */
export const Html = new HtmlSerializer({ rules: RULES })
