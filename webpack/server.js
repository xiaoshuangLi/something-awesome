require('dotenv').config({ silent: true });

var express = require('express');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var port = 3000;
var isPro = global.env == 'production';

if(!isPro) {
	var compiler = webpack(config);
	app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
	app.use(webpackHotMiddleware(compiler))
}

app.use(express.static('./public'));
app.use(express.static('./node_modules'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + (isPro ? '/public/html/' : '') + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
