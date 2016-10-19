global.platform = 'merrycos';
global.config = require('./config/config');

var express = require('express');

var app = express();
var port = config.port || 8082;

app.listen(port);

console.info(platform + ' started on port ' + port);
