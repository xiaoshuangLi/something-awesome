import 'babel-polyfill'
import test from './module'
import '../css/base.scss'
import $ from "jquery"

test()

$('body').addClass('a');