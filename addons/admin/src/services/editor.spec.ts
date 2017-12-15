import { registerEditable, getEditorSchema } from './editor'
import { Field } from '../interfaces'

describe('editor service', () => {
  it('can register editable and receive editor schema', () => {
    const modelName = 'article'
    const fields = [{ field: 'fields.testField', label: 'testLabel' }]

    registerEditable(modelName, fields)
  })

  it('can return editor schema', () => {
    const modelName = 'comment'

    expect(getEditorSchema({ type: modelName })).toEqual([])
  })

  it('can register fields and then filter them with a procedure', () => {
    const modelName = 'post'
    const fields = [
      { field: 'fields.firstName' },
      { field: 'fields.lastName' },
      { field: 'fields._fieldThatShouldNotBeEditable' },
    ]

    registerEditable(modelName, targetSchema => {
      targetSchema.delete('fields._fieldThatShouldNotBeEditable')
    })

    const schema = getEditorSchema({
      type: modelName,
      editorSchema: fields,
    })
    expect(fields).toHaveLength(3)
    expect(schema).toHaveLength(2)
  })
})
