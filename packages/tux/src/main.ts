import adminOnly from './utils/adminOnly'
const stub = () => {}

export { default as TuxProvider } from './components/TuxProvider'
export { default as Editable } from './components/Editable'
export { default as EditInline } from './components/EditInline'
export { default as EditModal } from './components/EditModal'
export { default as ModelCreator } from './components/ModelCreator'

export const BooleanField = adminOnly('BooleanField')
export const DatePicker = adminOnly('DatePicker')
export const Dropdown = adminOnly('Dropdown')
export const ImageField = adminOnly('ImageField')
export const MarkdownField = adminOnly('MarkdownField')
export const Radio = adminOnly('Radio')
export const TagEditor = adminOnly('TagEditor')
export const Input = adminOnly('Input')

export const registerEditable = stub
export const getEditorSchema = adminOnly('getEditorSchema')
export { default as Field } from './interfaces/field'
export { default as Meta } from './interfaces/meta'
export { default as AdapterInterface } from './interfaces/adapter'
