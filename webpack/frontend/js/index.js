import 'babel-polyfill'
import React from 'react'
import ReactDom from 'react-dom'
import Page from './components/page'
import '../css/index.scss'

const data = {};

ReactDom.render(
  (<Page {...data} />),
	document.getElementById('app')
)

var lxss = Object.assign