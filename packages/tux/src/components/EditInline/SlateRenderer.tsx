import React from 'react'
import { Editor } from 'slate'

export interface Props {
  state: any,
  children?: any,
  onChange?: (editorState: any) => void
  readOnly: boolean,
  placeholder?: string,
}

/**
 * Define a schema.
 */
const schema = {
  nodes: {
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'code': props => <pre><code {...props.attributes}>{props.children}</code></pre>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'heading-three': props => <h3 {...props.attributes}>{props.children}</h3>,
    'heading-four': props => <h4 {...props.attributes}>{props.children}</h4>,
    'heading-five': props => <h5 {...props.attributes}>{props.children}</h5>,
    'heading-six': props => <h6 {...props.attributes}>{props.children}</h6>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
    'quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'link': (props) => {
      const { data } = props.node
      const href = data.get('href')
      return <a href={href} {...props.attributes}>{props.children}</a>
    }
  },
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
  }
}

const SlateRenderer = (props: Props) => {
  return (
    <Editor
      style={{width: '100%'}}
      schema={schema}
      {...props}
    />
  )
}

export default SlateRenderer
