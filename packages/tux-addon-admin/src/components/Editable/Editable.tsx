import React, { ReactType, ComponentClass, StatelessComponent, ReactNode, ReactElement } from 'react'
import { EditableProps } from '../../interfaces'
import { createEditable } from './createEditable'

export interface Props extends EditableProps {
  children: ReactNode
}

const Internal = ({ children }: Props) => (
  children as ReactElement<any>
)

export default createEditable()(Internal)
