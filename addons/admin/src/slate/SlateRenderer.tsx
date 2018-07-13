import React from 'react'
import {
  Editor,
  EditorProps,
  RenderMarkProps,
  RenderNodeProps,
} from 'slate-react'

const renderNode = (props: RenderNodeProps) => {
  const { attributes, children, node } = props

  switch (node.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'code':
      return (
        <pre>
          <code {...props.attributes}>{props.children}</code>
        </pre>
      )
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'link': {
      const { data } = props.node
      const href = data.get('href')
      return (
        <a href={href} {...attributes}>
          {children}
        </a>
      )
    }
  }
}

const renderMark = (props: RenderMarkProps) => {
  const { attributes, children, mark } = props

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'code':
      return <code {...attributes}>{children}</code>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underlined':
      return <u {...attributes}>{children}</u>
  }
}

const SlateRenderer = (props: EditorProps) => {
  return (
    <Editor
      style={{ width: '100%' }}
      renderNode={renderNode}
      renderMark={renderMark}
      {...props}
    />
  )
}

export default SlateRenderer
