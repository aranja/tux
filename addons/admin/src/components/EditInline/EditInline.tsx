import React, { ReactElement, ReactNode, StatelessComponent } from 'react'
import PropTypes from 'prop-types'
import SlateRenderer from '../../slate/SlateRenderer'
import { createEditable } from '../Editable'
import { EditableProps } from '../../interfaces'
import { get } from '../../utils/accessors'
import { deserialize, Format } from '../../slate/serializers'

export type Props = EditableProps & {
  children?: ReactNode
  field: string | Array<string>
  format?: Format
}

export const EditInline: StatelessComponent<Props> = ({
  children,
  model,
  field,
  format,
}) => {
  const value = get(model, field)
  let state = null
  try {
    state = deserialize(value, format)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error('Could not parse content value', value, err)
  }

  if (state) {
    return <SlateRenderer state={state} readOnly={true} />
  } else {
    return (children as ReactElement<any>) || null
  }
}

EditInline.defaultProps = {
  format: 'plain',
}

EditInline.propTypes = {
  format: PropTypes.oneOf(['plain', 'html', 'raw']),
  model: PropTypes.object,
  field: PropTypes.string,
  children: PropTypes.any,
}

export default createEditable<Props>()(EditInline)
