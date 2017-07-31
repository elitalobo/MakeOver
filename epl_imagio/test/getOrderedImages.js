var getOrderedImages = require("./../src/routes/requestHandler").getOrderedImages
var Socket = require("./../src/socket").Socket
var image = require("./../src/image").image
var image_url = require("./../src/image_url").image_url


 
var photos = [] 
var image1 = new image("shutterstock",null,null,[new image_url("https://farm6.staticflickr.com/5595/30699089350_5971d8bbab_t.jpg", 200,200)]);
var image2 = new image("pixabay",null, null, [new image_url("https://farm6.staticflickr.com/5698/22822064408_806c63c97f_t.jpg", 200, 200)]);
var image3 = new image("shutterstock",null,null,[new image_url("https://farm6.staticflickr.com/5595/30699089350_5971d8bbab_t.jpg", 200,200)]);
var image4 = new image("pixabay",null, null, [new image_url("https://farm6.staticflickr.com/5698/22822064408_806c63c97f_t.jpg", 200, 200)]);

var sources = ["pixabay", "shutterstock"]

photos.push(image1);
photos.push(image3);
photos.push(image2);
photos.push(image4);

var assert = require('assert');
describe('Image Search', function() {
  this.timeout(30000);
  describe('#getOrderedImages', function() {
    this.timeout(30000);
    it('Order the images wrt relevance. The first image from all souces should be displayed before displaying the second images obtained from all sources', function() {
      	var ordered_images = getOrderedImages(photos);
	assert.deepEqual(ordered_images.length,4);
	
	for(var cnt=0;cnt<4;cnt++) {
		assert.deepEqual(ordered_images[cnt].source, sources[cnt%2]);
	}
		
    });
  });
});


