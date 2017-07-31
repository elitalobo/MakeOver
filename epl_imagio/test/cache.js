var checkCacheForImages = require("./../src/routes/requestHandler").checkCacheForImages
var getImagesFromCache = require("./../src/routes/requestHandler").getImagesFromCache
var addImageToCache = require("./../src/routes/requestHandler").addImageToCache
var Socket = require("./../src/socket").Socket
var image = require("./../src/image").image
var image_url = require("./../src/image_url").image_url

var socket = require('socket.io-client')('http://0.0.0.0:8080');

var responseObj = new Socket(socket);
  
var image1 = new image("shutterstock",null,null,[new image_url("https://farm6.staticflickr.com/5595/30699089350_5971d8bbab_t.jpg", 200,200)]);
var image2 = new image("pixabay",null, null, [new image_url("https://farm6.staticflickr.com/5698/22822064408_806c63c97f_t.jpg", 200, 200)]);
var image3 = new image("shutterstock",null,null,[new image_url("https://farm6.staticflickr.com/5595/30699089350_5971d8bbab_t.jpg", 200,200)]);
var image4 = new image("pixabay",null, null, [new image_url("https://farm6.staticflickr.com/5698/22822064408_806c63c97f_t.jpg", 200, 200)]);


var response = { uid : '12345678910', responseObj: responseObj };
var photos = []
photos.push(image1);
photos.push(image2);
photos.push(image3);
photos.push(image4);

var assert = require('assert');
describe('Image Search', function() {
  this.timeout(30000);
  describe('#Cache', function() {
    this.timeout(30000);
    describe('#addImageToCache', function() {
    	it('Image should be added to cache', function() {
		addImageToCache("black-all-all",image1);
		addImageToCache("black-all-all",image2);
		addImageToCache("black-all-all",image3);
		addImageToCache("black-all-all", image4);
		assert.deepEqual(checkCacheForImages("black","all","all"),true);
		getImagesFromCache("black","all","all",response);
		assert.deepEqual(responseObj.photos.length,4);
		for(var cnt=0;cnt<4; cnt++) {
			assert.deepEqual(responseObj.photos[cnt],photos[cnt]);
		}
		
	
      	});
    });
  });
});


