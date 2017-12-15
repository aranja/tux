export default {
  label: 'verify safe vs admin only functions',
  handler: prodTux => {
    const adminOnly = [
      'Input',
      'BooleanField',
      'DatePicker',
      'Dropdown',
      'ImageField',
      'MarkdownField',
      'Radio',
      'TagEditor',
      'getEditorSchema',
    ]
    const safe = ['registerEditable', 'TuxProvider', 'Editable']

    const all = new Set(Object.keys(prodTux))
    safe.forEach(name => all.delete(name))

    adminOnly.forEach(name => {
      expect(prodTux[name]).toThrowError(`Can\'t use ${name} in production.`)
      all.delete(name)
    })

    expect(Array.from(all.size)).toHaveLength(0)
  },
}
