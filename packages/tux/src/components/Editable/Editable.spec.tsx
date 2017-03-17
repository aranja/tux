import React from 'react'
import Editable from './Editable'
import { createEditable } from './Editable'

describe('createEditable', () => {
  it('should return a function', () => {
    expect(typeof createEditable()).toBe('function')
  })

  it('should create an editable component', () => {
    const Editable = createEditable()(() => {
    })
  })
})

describe('Editable', () => {
  it('should be a component', () => {
    const element = <Editable /> as React.ReactElement<any>
    expect(React.isValidElement(element)).toBeTruthy()
  })
})
