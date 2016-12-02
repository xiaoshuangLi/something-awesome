import 'babel-polyfill'
import React from 'react'
import ReactDom from 'react-dom'
import Page from './components/page'
import '../css/index.scss'
import Bug from '../img/icon/bug.svg'

const data = {};

ReactDom.render(	
	(<div><Bug /></div>),
	document.getElementById('app')
)

