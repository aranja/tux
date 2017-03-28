import 'babel-polyfill'
import React from 'react'
import app from './app'
import { renderClient } from 'react-chain'

renderClient(app, document.getElementById('root'))
