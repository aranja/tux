import {
  BooleanField,
  DatePicker,
  Dropdown,
  ImageField,
  MarkdownField,
  Radio,
  TextField,
} from 'tux'

export default {
  assetLinkEditor: ImageField,
  boolean: BooleanField,
  datePicker: DatePicker,
  dropdown: Dropdown,
  markdown: MarkdownField,
  radio: Radio,
  singleLine: TextField,
}

//     if (widgetId === 'boolean') {
//       return (
//         <div key={type.id}>
//           <Boolean
//             id={type.id}
//             boolLabels={Object.values(type.control.settings)}
//             value={value}
//             label={type.name}
//             helpText={helpText}
//             onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
//           />
//         </div>
//       )
//     }

//     else if (widgetId === 'radio') {
//       return (
//         <div key={type.id}>
//           <Radio
//             id={type.id}
//             value={value}
//             label={type.name}
//             helpText={helpText}
//             choices={type.validations[0].in}
//             onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
//           />
//         </div>
//       )
//     }
//
//     else if (widgetId === 'dropdown') {
//       return (
//         <div key={type.id}>
//           <Dropdown
//             dropdownValues={type.validations[0].in}
//             id={type.id}
//             value={value}
//             label={type.name}
//             helpText={helpText}
//             onChange={(event: React.FormEvent<any>) => this.onChange(event, type)}
//           />
//         </div>
//       )
//     }
// <<<<<<< HEAD
