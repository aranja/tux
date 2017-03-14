import {
  BooleanField,
  DatePicker,
  Dropdown,
  ImageField,
  MarkdownField,
  Radio,
  TextField,
} from 'tux'

const widgetIdToEditor = {
  assetLinkEditor: ImageField,
  boolean: BooleanField,
  datePicker: DatePicker,
  dropdown: Dropdown,
  markdown: MarkdownField,
  radio: Radio,
  singleLine: TextField,
}

export default function generateEditorSchema(typeMeta: any) {
  return typeMeta.fields.map((field: any) => _transformTypeMetaFieldToEditorField(field))
}

function _transformTypeMetaFieldToEditorField(typeMetaField: any) {
  const props = _getPropsForType(typeMetaField)
  return {
    field: typeMetaField.id,
    label: typeMetaField.name,
    component: widgetIdToEditor[typeMetaField.control.widgetId],
    props,
  }
}

function _getPropsForType(typeMetaField: any) {
  const widgetId = typeMetaField.control.widgetId
  const props = {}
  if (widgetId === 'boolean') {
    props.boolLabels = Object.values(typeMetaField.control.settings)
  } else if (widgetId === 'dropdown') {
    props.dropdownValues = typeMetaField.validations[0].in
  } else if (widgetId === 'radio') {
    props.choices = typeMetaField.validations[0].in
  }
  return props
}
