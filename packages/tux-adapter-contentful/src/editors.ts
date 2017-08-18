import { ReactType } from 'react'
import {
  BooleanField,
  DatePicker,
  Dropdown,
  ImageField,
  MarkdownField,
  Radio,
  Input,
  TagEditor,
  RichTextField,
} from 'tux'

const widgetIdToEditor: { [id: string]: ReactType | undefined } = {
  assetLinkEditor: ImageField,
  boolean: BooleanField,
  datePicker: DatePicker,
  dropdown: Dropdown,
  markdown: MarkdownField,
  radio: Radio,
  singleLine: Input,
  tagEditor: TagEditor,
  objectEditor: RichTextField,
}

export default function generateEditorSchema(typeMeta: any) {
  return typeMeta.fields.map((field: any) =>
    _transformTypeMetaFieldToEditorField(field)
  )
}

function _transformTypeMetaFieldToEditorField(typeMetaField: any) {
  const props = _getPropsForType(typeMetaField)
  return {
    field: `fields.${typeMetaField.id}`,
    label: typeMetaField.name,
    component: widgetIdToEditor[typeMetaField.control.widgetId],
    props,
  }
}

function _getPropsForType(typeMetaField: any) {
  const widgetId = typeMetaField.control.widgetId
  const props: any = {}
  if (widgetId === 'boolean') {
    const labels = typeMetaField.control.settings
    props.boolLabels = Object.keys(labels).map(key => labels[key])
  } else if (widgetId === 'dropdown') {
    props.dropdownValues = typeMetaField.validations[0].in
  } else if (widgetId === 'radio') {
    props.choices = typeMetaField.validations[0].in
  }
  return props
}
