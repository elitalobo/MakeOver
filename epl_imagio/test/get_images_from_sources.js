var getImagesFromSource = require("./../src/routes/requestHandler").getImagesFromSource
var socket = require('socket.io-client')('http://0.0.0.0:8080');
var Socket = require("./../src/socket").Socket

var responseObj = new Socket(socket);
var assert = require('assert');
describe('Image Search', function() {
  this.timeout(30000);
  describe('#getImagesFromSources', function() {
    this.timeout(30000);
    it('Photos should be a non empty array', function(done) {
      getImagesFromSource("kite","all","all", { responseObj : responseObj, uid: "12345678910" }, function() {	console.log("calling calback"); assert.notEqual(responseObj.photos.length,0); done (); });
    });
  });
});


