import React from 'react'
import './styles.css'

export const H1 = ({ children }) => (
  <h1 className="t-h1">{children}</h1>
)

export const H2 = ({ children }) => (
  <h2 className="t-h2">{children}</h2>
)

export const Blockquote = ({ children }) => (
  <blockquote className="t-blockquote">{children}</blockquote>
)
