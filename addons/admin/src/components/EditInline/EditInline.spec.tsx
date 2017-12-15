import React, { ComponentType, ReactElement, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { resetKeyGenerator } from 'slate'
import { EditInline as EditInlineProd, Props } from './EditInline'
import { EditInline as EditInlineAdmin } from './EditInline'
import { MockContext } from '../../__tests__/mocks'

const describeBoth = (handler: (component: ComponentType<Props>) => void) => {
  describe('EditInlineProd', () => {
    handler(EditInlineProd)
  })
  describe('EditInlineAdmin', () => {
    handler(EditInlineAdmin)
  })
}

const staticSnapshot = (node: ReactNode) => {
  const result = renderToStaticMarkup(node as ReactElement<any>)
  expect(result).toMatchSnapshot()
}

const model = {
  field: 'Model value',
}

const htmlModel = {
  field: 'Model <strong>value</strong>',
}

const rawModel = {
  field: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              { text: 'Model ' },
              { text: 'value', marks: [{ type: 'bold' }] },
            ],
          },
        ],
      },
    ],
  },
}

beforeEach(() => {
  resetKeyGenerator()
})

describeBoth(EditInline => {
  it('should support empty value', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={model}
        field="missing"
      />
    )
    expect(result).toMatchSnapshot()
  })

  it('should support string fallback', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={model}
        field="missing"
      >
        Foo
      </EditInline>
    )
    expect(result).toMatch('Foo')
    expect(result).toMatchSnapshot()
  })

  it('should support mixed fallback', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={model}
        field="missing"
      >
        Hello <strong>world</strong>
      </EditInline>
    )
    expect(result).toMatch('Hello')
    expect(result).toMatch('<strong>world</strong>')
    expect(result).toMatchSnapshot()
  })

  it('should render plain field from model', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={model}
        field="field"
      >
        Hello world
      </EditInline>
    )
    expect(result).toMatch('Model value')
    expect(result).toMatchSnapshot()
  })

  it('should render plain field from html model', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={htmlModel}
        format="plain"
        field="field"
      >
        Hello world
      </EditInline>
    )
    expect(result).toMatch('Model &lt;strong&gt;value&lt;/strong&gt;')
    expect(result).toMatchSnapshot()
  })

  it('should render html field from html model', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={htmlModel}
        format="html"
        field="field"
      >
        Hello world
      </EditInline>
    )
    expect(result).toMatch('Model')
    expect(result).toMatch('<strong>value</strong>')
    expect(result).toMatchSnapshot()
  })

  it('should render html field from raw model', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={rawModel}
        format="html"
        field="field"
      >
        Hello world
      </EditInline>
    )
    expect(result).toMatch('Model')
    expect(result).toMatch('<strong>value</strong>')
    expect(result).toMatchSnapshot()
  })

  it('should render raw field from raw model', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={rawModel}
        format="raw"
        field="field"
      >
        Hello world
      </EditInline>
    )
    expect(result).toMatch('Model')
    expect(result).toMatch('<strong>value</strong>')
    expect(result).toMatchSnapshot()
  })

  it('should render raw field from html model', () => {
    const result = renderToStaticMarkup(
      <EditInline
        tux={new MockContext()}
        isEditing={false}
        model={htmlModel}
        format="raw"
        field="field"
      >
        Hello world
      </EditInline>
    )
    expect(result).toMatch('Model')
    expect(result).toMatch('<strong>value</strong>')
    expect(result).toMatchSnapshot()
  })
})
