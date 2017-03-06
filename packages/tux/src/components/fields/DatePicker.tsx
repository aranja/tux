import React, { Component } from 'react'
import classNames from 'classnames'
import DayPicker from 'react-day-picker'

const Weekday = ({ weekday, className, localeUtils, locale }) => {
  const weekdayName = localeUtils.formatWeekdayLong(weekday, locale)
  return (
    <div className={className} title={weekdayName}>
      {weekdayName.slice(0, 1)}
    </div>
  )
}

const Navbar = ({ nextMonth, previousMonth, onPreviousClick, onNextClick, localeUtils }) => {
  const months = localeUtils.getMonths()
  const prev = months[previousMonth.getMonth()]
  const next = months[nextMonth.getMonth()]
  return (
    <div className="TuxDatePicker-navbar">
      <span className="TuxDatePicker-navbarPrev" onClick={() => onPreviousClick()}>
        <span className="icon icon-arrow_left"></span>{prev.slice(0, 3)}
      </span>
      <span className="TuxDatePicker-navbarNext" onClick={() => onNextClick()}>
        {next.slice(0, 3) }<span className="icon icon-arrow_right"></span>
      </span>
      <style jsx>{`
        .TuxDatePicker-navbar {
          width: 252px;
          display: flex;
          justify-content: space-between;
        }
        .TuxDatePicker-navbar :global(.icon) {
          padding: 0 10px;
        }
      `}</style>
    </div>
  )
}

class DatePicker extends Component {

  componentDidMount() {
    const { value } = this.props

    this.setState({
      selectedDay: new Date(value)
    })
  }

  state = {
    visible: false,
    selectedDay: new Date(),
  }

  handleInputClick = () => {
    this.setState({
      visible: true
    })
  }

  handleDayClick = (day, { disabled, selected }) => {
    if (disabled) {
      return
    }
    this.setState({
      selectedDay: selected ? null : day
    })
  },

  render() {
    const { visible, selectedDay } = this.state
    const { id, value, label, onChange } = this.props

    return (
      <div className="TuxDayPicker">
        <input className="TuxDayPicker-input" value={selectedDay} onClick={this.handleInputClick} />
        <DayPicker
          weekdayElement={ <Weekday /> }
          navbarElement={ <Navbar /> }
          onDayClick={this.handleDayClick}
        />
      <style jsx>{`
        .TuxDayPicker :global(.DayPicker) {
          font-family: -apple-system, BlinkMacSystemFont, "Source Sans Pro", "sans-serif";
          font-size: 12px;
          padding: 1rem 0;
          position: relative;
          user-select: none;
          font-weight: 300;
        }

        .TuxDayPicker :global(.DayPicker-Month) {
          display: table;
          border-collapse: collapse;
          border-spacing: 0;
          user-select: none;
        }

        .TuxDayPicker :global(.DayPicker-NavBar) {
          position: absolute;
          left: 0;
          right: 0;
          padding: 0 .5rem;
        }

        .TuxDayPicker :global(.DayPicker-NavButton) {
          position: absolute;
          width: 1.5rem;
          height: 1.5rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          cursor: pointer;
        }

        .TuxDayPicker :global(.DayPicker-Caption) {
          display: table-caption;
          font-size: 12px;
          height: 1.5rem;
          margin-top: -18px;
          text-align: center;
        }

        .TuxDayPicker :global(.DayPicker-Weekdays) {
          display: table-header-group;
        }

        .TuxDayPicker :global(.DayPicker-WeekdaysRow) {
          display: table-row;
        }

        .TuxDayPicker :global(.DayPicker-Weekday) {
          display: table-cell;
          padding: .5rem;
          font-size: .875em;
          text-align: center;
          color: #8b9898;
        }

        .TuxDayPicker :global(.DayPicker-Body) {
          display: table-row-group;
        }

        .TuxDayPicker :global(.DayPicker-Week) {
          display: table-row;
        }

        .TuxDayPicker :global(.DayPicker-Day) {
          display: table-cell;
          padding: .5rem;
          border: 1px solid #eaecec;
          text-align: center;
          cursor: pointer;
          vertical-align: middle;
          background: #fff;
        }

        .TuxDayPicker :global(.DayPicker--interactionDisabled .DayPicker-Day) {
          cursor: default;
        }

        /*Modifiers*/
        .TuxDayPicker :global(.DayPicker-Day--today) {
          color: #d0021b;
          font-weight: 500;
        }

        .TuxDayPicker :global(.DayPicker-Day--disabled) {
          color: #dce0e0;
          cursor: default;
          background-color: #eff1f1;
        }

        .TuxDayPicker :global(.DayPicker-Day--outside) {
          cursor: default;
          color: #dce0e0;
          background: #fafafa;
        }

        .TuxDayPicker-input {
          background: #FFFFFF;
          border: 1px solid #CBCBCB;
          border-radius: 3px;
          color: #313131;
          display: inline-block;
          font-size: 16px;
          padding: 5px;
          line-height: 1.5;
        }
      `}</style>
      </div>
    )
  }
}

export default DatePicker
