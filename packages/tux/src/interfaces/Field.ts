import { ReactType } from 'react'

interface Field {
  field: string
  label: string
  component: ReactType
  props?: Object
}

export default Field
