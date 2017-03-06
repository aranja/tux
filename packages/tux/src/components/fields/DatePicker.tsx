import React, { Component } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import DayPicker, { DateUtils } from 'react-day-picker'
import { tuxColors, tuxInputStyles, tuxDatePickerStyles } from '../../styles'
import { fade } from '../../utils/color'

const DATE_FORMAT = 'YYYY-MM-DD'

class DatePicker extends Component {

  clickedInside = false

  componentWillUnmount() {
    clearTimeout(this.clickTimeout)
  }

  state = {
    showOverlay: false,
    value: moment(this.props.value).format(DATE_FORMAT),
  }

  handleContainerMouseDown = () => {
    this.clickedInside = true
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false
    }, 0)
  }

  handleInputFocus = () => {
    this.setState({
      showOverlay: true,
    })
  }

  handleInputBlur = () => {
    const showOverlay = this.clickedInside

    this.setState({
      showOverlay,
    })

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      this.input.focus()
    }
  }

  handleDayClick = (day, modifiers, event) => {
    this.setState({
      value: moment(day).format(DATE_FORMAT),
      selectedDay: day,
      showOverlay: false,
    })
    this.input.blur()
  }

  render() {
    const { visible, selectedDay, showOverlay, value } = this.state
    const { id, label, onChange } = this.props

    return (
      <div className="TuxDayPicker" onMouseDown={ this.handleContainerMouseDown }>
        <label className="TuxDayPicker-inputLabel">{ label }</label>
        <input
          className="TuxDayPicker-input"
          type="text"
          ref={(el) => {this.input = el}}
          placeholder="Select a date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
        />
        { showOverlay &&
          <div className="TuxDayPicker-overlay">
            <DayPicker
              initialMonth={selectedDay || undefined}
              onDayClick={this.handleDayClick}
              selectedDays={day => DateUtils.isSameDay(selectedDay, day)}
            />
          </div>
        }
      <style jsx>{`
        .TuxDayPicker {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .TuxDayPicker :global(.DayPicker) {
          font-family: -apple-system, BlinkMacSystemFont, "Source Sans Pro", "sans-serif";
          font-size: 12px;
          font-weight: 300;
          margin: 0;
          padding: 10px;
          position: relative;
          user-select: none;
          width: 260px;
        }

        .TuxDayPicker .TuxDayPicker-input {
          appearance: none;
          border-radius: 3px;
          border: 1px solid ${tuxInputStyles.borderColor};
          color: ${tuxColors.textDark};
          font-family: -apple-system, BlinkMacSystemFont, "Source Sans Pro", "sans-serif";
          font-size: 16px;
          font-weight: 300;
          line-height: 1.5;
          padding: 5px;
          width: 260px;
        }

        .TuxDayPicker .TuxDayPicker-inputLabel {
          color: ${tuxInputStyles.labelTextColor};
          font-size: 16px;
          font-weight: 300;
          line-height: 24px;
          padding: 4px 0;
          text-transform: capitalize;
        }

        .TuxDayPicker .TuxDayPicker-overlay {
          background: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, .15);
          position: absolute;
          position: absolute;
          top: 70px;
        }

        .TuxDayPicker :global(.DayPicker-Month) {
          border-collapse: collapse;
          border-spacing: 0;
          display: table;
          user-select: none;
        }

        .TuxDayPicker :global(.DayPicker-NavBar) {
          left: 0;
          padding: 0 8px;
          position: absolute;
          right: 0;
        }

        .TuxDayPicker :global(.DayPicker-NavButton) {
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          cursor: pointer;
          height: 16px;
          position: absolute;
          width: 16px;
        }

        .TuxDayPicker :global(.DayPicker-Caption) {
          display: table-caption;
          font-size: 12px;
          height: 24px;
          text-align: center;
        }

        .TuxDayPicker :global(.DayPicker-Weekdays) {
          display: table-header-group;
        }

        .TuxDayPicker :global(.DayPicker-WeekdaysRow) {
          display: table-row;
        }

        .TuxDayPicker :global(.DayPicker-Weekday) {
          color: ${fade(tuxColors.colorBlack, 0.4)};
          display: table-cell;
          font-size: 14px;
          padding: 8px;
          text-align: center;
        }

        .TuxDayPicker :global(.DayPicker-Body) {
          display: table-row-group;
        }

        .TuxDayPicker :global(.DayPicker-Week) {
          display: table-row;
        }

        .TuxDayPicker :global(.DayPicker-Day) {
          background: ${tuxDatePickerStyles.backgroundColor};
          border: 1px solid #eaecec;
          cursor: pointer;
          display: table-cell;
          padding: 8px;
          text-align: center;
          vertical-align: middle;
        }

        .TuxDayPicker :global(.DayPicker-Day:hover) {
          background: #eaecec;
        }

        .TuxDayPicker :global(.DayPicker--interactionDisabled .DayPicker-Day) {
          cursor: default;
        }

        .TuxDayPicker :global(.DayPicker-NavButton--prev) {
          background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0\
          iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI2cHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0\
          iMCAwIDI2IDUwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM\
          6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2h\
          lbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjIgKDEyMDQ\
          zKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5wcmV2PC90aXR\
          sZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGc\
          gaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0\
          iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9InByZXYiIHNrZXRjaDp0eXBlPSJ\
          NU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjM5MzE5MywgMjUuMDAwMDAwKSBzY2FsZSgtMSw\
          gMSkgdHJhbnNsYXRlKC0xMy4zOTMxOTMsIC0yNS4wMDAwMDApIHRyYW5zbGF0ZSgwLjg5MzE5MywgMC4wMDAwMDA\
          pIiBmaWxsPSIjNTY1QTVDIj4KICAgICAgICAgICAgPHBhdGggZD0iTTAsNDkuMTIzNzMzMSBMMCw0NS4zNjc0MzQ\
          1IEwyMC4xMzE4NDU5LDI0LjcyMzA2MTIgTDAsNC4yMzEzODMxNCBMMCwwLjQ3NTA4NDQ1OSBMMjUsMjQuNzIzMDY\
          xMiBMMCw0OS4xMjM3MzMxIEwwLDQ5LjEyMzczMzEgWiIgaWQ9InJpZ2h0IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUd\
          yb3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K");
          left: 16px;
        }

        .TuxDayPicker :global(.DayPicker-NavButton--next) {
          background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0\
          iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI2cHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0\
          iMCAwIDI2IDUwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM\
          6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2h\
          lbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjIgKDEyMDQ\
          zKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5uZXh0PC90aXR\
          sZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGc\
          gaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0\
          iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9Im5leHQiIHNrZXRjaDp0eXBlPSJ\
          NU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuOTUxNDUxLCAwLjAwMDAwMCkiIGZpbGw9IiM1NjV\
          BNUMiPgogICAgICAgICAgICA8cGF0aCBkPSJNMCw0OS4xMjM3MzMxIEwwLDQ1LjM2NzQzNDUgTDIwLjEzMTg0NTk\
          sMjQuNzIzMDYxMiBMMCw0LjIzMTM4MzE0IEwwLDAuNDc1MDg0NDU5IEwyNSwyNC43MjMwNjEyIEwwLDQ5LjEyMzc\
          zMzEgTDAsNDkuMTIzNzMzMSBaIiBpZD0icmlnaHQiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4\
          KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=");
          right: 16px;
        }

        /*Modifiers*/
        .TuxDayPicker :global(.DayPicker-Day--today) {
          font-weight: 500;
        }

        .TuxDayPicker :global(.DayPicker-Day--disabled) {
          background-color: ${tuxDatePickerStyles.backgroundColorDisabled};
          color: ${tuxDatePickerStyles.textColor};
          cursor: default;
        }

        .TuxDayPicker :global(.DayPicker-Day--selected) {
          background: ${tuxInputStyles.greenTheme.borderColor};
          color: ${tuxDatePickerStyles.textColorSelected};
        }

        .TuxDayPicker :global(.DayPicker-Day--selected:hover) {
          background: ${tuxInputStyles.greenTheme.borderColor};
          color: ${tuxDatePickerStyles.textColorSelected};
        }

        .TuxDayPicker :global(.DayPicker-Day--outside) {
          background: ${tuxDatePickerStyles.backgroundColorOutside};
          color: ${tuxDatePickerStyles.textColor};
          cursor: default;
        }

        .TuxDayPicker-input {
          background: ${tuxInputStyles.backgroundColor};
          border: 1px solid ${tuxInputStyles.borderColor};
          border-radius: 3px;
          color: ${tuxColors.textDark};
          font-size: 16px;
          padding: 5px;
          line-height: 1.5;
          width: 260px;
        }

        .TuxDayPicker-input:focus {
          border-color: ${tuxInputStyles.greenTheme.borderColor};
          outline: 1px solid ${tuxInputStyles.greenTheme.borderColor};
        }

      `}</style>
      </div>
    )
  }
}

export default DatePicker
