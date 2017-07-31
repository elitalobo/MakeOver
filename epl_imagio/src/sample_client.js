

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(5999);


app.get('/', function (req, res) {
  console.log("got request on client");
});


var socket = require('socket.io-client')('http://ec2-35-160-140-204.us-west-2.compute.amazonaws.com:9000/');
console.log(socket);
socket.emit('getImages',{ keywords: "rat" }  );
console.log("emitted");
socket.on('gotImages', function(data) {
        console.log(data);
});

socket.on('gotImage', function(data) {
	console.log(data);
});

socket.on('noMoreImages', function(data) {
	console.log(data);
});

socket.on('noImagesFound', function(data) {
	console.log(data);
});

socket.on('error', function(data) {
	console.log(data);
});

socket.on('got_error', function(data) {
	console.log(data);
});

socket.on('request_acknowledged', function(data) {
	console.log(data);
});

socket.on('disconnect_from_server', function(data) {
	console.log("asking server to disconnect");
	socket.emit('disconnect_client', null);
	socket.disconnect(true)
});



