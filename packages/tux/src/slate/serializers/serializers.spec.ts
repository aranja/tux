import deserialize from './deserialize'
import serialize from './serialize'

const testHtml = `<p>Hello <em>italic</em> <strong>bold</strong> <u>underlined</u> <a href="foo">link</a> <code>code</code></p><ul><li>List</li></ul><ol><li>Ordered list</li></ol><blockquote><code>Fancy code</code></blockquote><h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>`

describe('serializers', () => {
  it('safely roundtrips html', () => {
    const state = deserialize(testHtml, 'html')
    const newHtml = serialize(state, 'html')
    expect(newHtml).toEqual(testHtml)
  })

  it('safely roundtrips plain', () => {
    const oldPlain = `
    Test test.
    
    Ok.
    `

    const state = deserialize(oldPlain, 'plain')
    const newPlain = serialize(state, 'plain')
    expect(newPlain).toEqual(oldPlain)
  })

  it('safely roundtrips html and raw', () => {
    let state = deserialize(testHtml, 'html')
    const raw = serialize(state, 'raw')
    expect(raw).toMatchSnapshot()

    state = deserialize(raw, 'raw')
    const newHtml = serialize(state, 'html')
    expect(newHtml).toEqual(testHtml)
  })
})
