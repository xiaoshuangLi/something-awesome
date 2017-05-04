var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config')

var users = {};
var count = 0;
var list = [];

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

io.on('connection', function(socket) {
  count ++;
  console.log('Got ' + count);

  socket.on('login', function() {});
  socket.on('disconnect', function() {});
  socket.on('message', function(data) {
    console.log(data.name + ': ' + data.message);
    list.push(data);
    io.emit('message', list);
  });
});

app.get("*", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

http.listen(3000, function() {
  console.log('listening on *:3000');
})