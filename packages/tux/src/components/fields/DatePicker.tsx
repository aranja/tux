import React, { Component } from 'react'
import classNames from 'classnames'
import DatePicker from 'material-ui/DatePicker'
import moment from 'moment'
import FaCalendar from 'react-icons/lib/fa/calendar'
import { fade } from '../../utils/color'

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_VALUE = moment(new Date()).format(DATE_FORMAT)

export interface State {
  selectedDay: Date | null
}

class DatePick extends Component<any, State> {
  constructor(props: any) {
    super(props)

    const { value } = this.props
    const dateValue = value ? value : DEFAULT_VALUE

    this.state = {
      selectedDay: moment(dateValue).toDate(),
    }
  }

  handleChange = (event: null, date: Date) => {
    const { onChange } = this.props
    onChange(date)
    this.setState({
      selectedDay: date
    })
  }

  render() {
    const { selectedDay, value } = this.state
    const { id, onChange } = this.props

    return (
      <DatePicker
        floatingLabelText="Date picker"
        hintText="Pick a day"
        container="inline"
        onChange={this.handleChange}
        value={selectedDay}
      />
    )
  }
}

export default DatePick
