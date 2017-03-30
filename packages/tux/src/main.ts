import adminOnly from './utils/adminOnly'
const stub = () => {}

export { default as TuxProvider } from './components/TuxProvider'
export { default as Editable } from './components/Editable'
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
export { Field, Meta } from './services/editor'
export const AdapterInterface = adminOnly('AdapterInterface')
