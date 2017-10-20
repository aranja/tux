import React from 'react'
import classNames from 'classnames'
import HistoryLink from '../HistoryLink'
import './styles.css'

const Link = ({ className, ...props }) => (
  <HistoryLink className={classNames('Link', className)} {...props} />
)

export default Link
