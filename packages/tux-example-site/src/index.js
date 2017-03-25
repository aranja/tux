import 'babel-polyfill'
import React from 'react'
import app from './app'
import { renderClient } from 'react-chain/lib/render'

renderClient(app, document.getElementById('root'))
