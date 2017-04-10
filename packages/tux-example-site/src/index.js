import 'babel-polyfill'
import React from 'react'
import app from './app'
import { startClient } from 'react-chain'

startClient(app, document.getElementById('root'))
