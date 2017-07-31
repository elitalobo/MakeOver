var processImages = require("./../src/routes/requestHandler").processImages
var Socket = require("./../src/socket").Socket
var image = require("./../src/image").image
var image_url = require("./../src/image_url").image_url


var socket = require('socket.io-client')('http://0.0.0.0:8080');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(4444);


app.get('/', function (req, res) {
  console.log("got request on client");
});



var assert = require('assert');
describe('Image Search', function() {
  this.timeout(30000);
  describe('#Invalid Type', function() {
    this.timeout(30000);
    it('Expected Invalid Type message', function(done) {
		socket.emit('getImages',{ keywords: "cat", color: "black", type: "building"} );
		socket.on('got_error', function(data) {
        			assert.deepEqual(data.message, "Invalid Type") 
        			done();
        		});
      		
    });
  });
});







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


socket.on('request_acknowledged', function(data) {
	console.log(data);
});

socket.on('disconnect_from_server', function(data) {
	console.log("asking server to disconnect");
	socket.emit('disconnect_client', null);
	socket.disconnect(true)
});



