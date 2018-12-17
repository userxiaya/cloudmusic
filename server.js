var express = require('express');
var app = express();
var request = require('request');
var app = express();
app.use('/apis', function(req, res) {
    var url = 'http://47.107.134.246:3000/' + req.url.replace('/apis/','');
    req.pipe(request(url)).pipe(res);
});
app.use(express.static('dist'));
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})