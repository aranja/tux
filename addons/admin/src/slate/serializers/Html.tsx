import React from 'react'
import { Block, Html as HtmlSerializer, Inline, Mark } from 'slate'

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
  h6: 'heading-six',
}

/**
 * Tags to marks.
 */
const MARK_TAGS: { [key: string]: string } = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
}

/**
 * Serializer rules.
 */
const RULES: HtmlSerializer.Rule[] = [
  {
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'pre') {
        return
      }
      const code = el.childNodes[0] as HTMLElement | undefined
      const childNodes =
        code && code.tagName.toLowerCase() === 'code'
          ? code.childNodes
          : el.childNodes

      return {
        kind: 'block',
        type: 'code',
        nodes: next(childNodes),
      }
    },
  },
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (!block) {
        return
      }
      return {
        kind: 'block',
        type: block,
        nodes: next(el.childNodes),
      }
    },

    serialize(object, children) {
      if (object.kind !== 'block') {
        return
      }
      switch ((object as Block).type) {
        case 'line': {
          return <p>{children}</p>
        }
        case 'paragraph': {
          return <p>{children}</p>
        }
        case 'list-item': {
          return <li>{children}</li>
        }
        case 'bulleted-list': {
          return <ul>{children}</ul>
        }
        case 'numbered-list': {
          return <ol>{children}</ol>
        }
        case 'quote': {
          return <blockquote>{children}</blockquote>
        }
        case 'code': {
          return (
            <pre>
              <code>{children}</code>
            </pre>
          )
        }
        case 'heading-one': {
          return <h1>{children}</h1>
        }
        case 'heading-two': {
          return <h2>{children}</h2>
        }
        case 'heading-three': {
          return <h3>{children}</h3>
        }
        case 'heading-four': {
          return <h4>{children}</h4>
        }
        case 'heading-five': {
          return <h5>{children}</h5>
        }
        case 'heading-six': {
          return <h6>{children}</h6>
        }
      }
    },
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()]
      if (!mark) {
        return
      }
      return {
        kind: 'mark',
        type: mark,
        nodes: next(el.childNodes),
      }
    },

    serialize(object, children) {
      if (object.kind !== 'mark') {
        return
      }
      switch ((object as Mark).type) {
        case 'bold':
          return <strong>{children}</strong>
        case 'italic':
          return <em>{children}</em>
        case 'underline':
          return <u>{children}</u>
        case 'strikethrough':
          return <s>{children}</s>
        case 'code':
          return <code>{children}</code>
      }
    },
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() !== 'a') {
        return
      }
      return {
        kind: 'inline',
        type: 'link',
        nodes: next(el.childNodes),
        data: {
          href: el.getAttribute('href'),
        },
      }
    },

    serialize(object, children) {
      if (object.kind !== 'inline' || (object as Inline).type !== 'link') {
        return
      }
      const link = object as Inline
      return <a href={link.data.get('href')}>{children}</a>
    },
  },
]

/**
 * Create a new HTML serializer with `RULES`.
 */
export const Html = new HtmlSerializer({
  rules: RULES,
  parseHtml:
    process.env.TUX_BUILD_TARGET === 'server'
      ? require('parse5').parseFragment
      : undefined,
})
