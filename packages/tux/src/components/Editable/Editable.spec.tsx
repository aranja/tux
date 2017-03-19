import React from 'react'
import { createEditable } from './Editable'

describe('createEditable', () => {
  it('should return a function', () => {
    expect(typeof createEditable()).toBe('function')
  })

  it('should create an editable component', () => {
    const Editable = createEditable()(() => {
      return <div></div>
    })
  })
})
