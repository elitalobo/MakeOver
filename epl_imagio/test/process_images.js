var processImages = require("./../src/routes/requestHandler").processImages
var Socket = require("./../src/socket").Socket
var image = require("./../src/image").image
var image_url = require("./../src/image_url").image_url

var socket = require('socket.io-client')('http://0.0.0.0:8080');

var responseObj = new Socket(socket);
  
var image1 = new image("shutterstock",null,null,[new image_url("https://farm6.staticflickr.com/5595/30699089350_5971d8bbab_t.jpg", 200,200)]);
var image2 = new image("pixabay",null, null, [new image_url("https://farm6.staticflickr.com/5698/22822064408_806c63c97f_t.jpg", 200, 200)]);
responseObj.photos.push(image1);
responseObj.photos.push(image2);

var assert = require('assert');
describe('Image Search', function() {
  this.timeout(30000);
  describe('#processImages', function() {
    this.timeout(30000);
    it('Photos should be a non empty array', function(done) {
      processImages("kite","all","all", { responseObj : responseObj, uid: "12345678910" }, function() {	console.log("calling calback"); 
	 var photos = responseObj.photos;
	 for(var cnt=0; cnt < photos.length;cnt++) {
		assert.notEqual(photos[cnt].colors,undefined);
		assert.notEqual(photos[cnt].colors,null);
		assert.notEqual(photos[cnt].types, undefined);
		assert.notEqual(photos[cnt].types,null);
	 }
	 done (); });
    });
  });
});


