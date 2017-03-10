
import { registerEditable, getEditorSchema, Field, Meta } from './editor'

describe('editor service', () => {
  it('can register editable and receive editor schema', () => {
    const modelName = 'article'
    const fields = [
      { field: 'testField', label: 'testLabel' }
    ]

    registerEditable(modelName, fields)
  })

  it('can return editor schema', () => {
    const modelName = 'comment'

    expect(getEditorSchema({ type: modelName })).toEqual([])
  })

  it('can register fields and then filter them with a procedure', () => {
    const modelName = 'post'
    const fields = [
      { field: 'firstName' },
      { field: 'lastName' },
      { field: '_fieldThatShouldNotBeEditable' },
    ]

    registerEditable(modelName, (schema: any) =>
      schema.filter((field: any) => field.field !== '_fieldThatShouldNotBeEditable')
    )

    const schema = getEditorSchema({
      type: modelName,
      editorSchema: fields,
    })
    expect(fields).toHaveLength(3)
    expect(schema).toHaveLength(2)
  })
})
