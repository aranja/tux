import React, { Component } from 'react'

import TextField from './TextField'
import MarkdownField from './MarkdownField'
import ImageField from './ImageField'
import DatePicker from '../fields/DatePicker'

import { registerEditable, Field } from '../../services/editor'

registerEditable('sellPoint', [
  {
    field: 'title',
    label: 'The title text of the Sell Point',
    component: TextField,
  },
  {
    field: 'icon',
    label: 'The image displayed with the Sell Point',
    component: ImageField,
  },
  {
    field: 'text',
    label: 'The sale speech of the Sell Point',
    component: MarkdownField,
  },
  {
    field: 'date',
    label: 'Something about the date',
    component: DatePicker,
  }
])

registerEditable('carousel', [
  {
    field: 'title',
    label: 'The title text of the Carousel',
    component: TextField,
  },
  {
    field: 'image',
    label: 'The image displayed with the Carousel',
    component: ImageField,
  },
  {
    field: 'text',
    label: 'The sale speech of the Carousel',
    component: MarkdownField,
  },
])
