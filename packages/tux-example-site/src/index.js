import 'babel-polyfill'
import React from 'react'
import tux from './tux'
import { startClient } from 'tux/lib/tux'

startClient(tux, document.getElementById('root'))
