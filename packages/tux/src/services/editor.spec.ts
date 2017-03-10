
import { registerEditable, getEditorSchema } from './editor'

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
      { field: 'keep' },
      { field: 'keep' },
      { field: 'remove' },
      { field: 'keep' },
    ]

    registerEditable(modelName, fields)
    let schema = getEditorSchema({ type: modelName })
    expect(schema).toHaveLength(4)

    registerEditable(modelName, (schema: any) =>
      schema.filter((field: any) => field.field === 'keep')
    )

    schema = getEditorSchema({ type: modelName })
    expect(schema).toHaveLength(3)
  })
})
