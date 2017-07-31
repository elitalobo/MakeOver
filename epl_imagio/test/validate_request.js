var validateRequest = require("./../src/routes/requestHandler").validateRequest
var Socket = require("./../src/socket").Socket
var image = require("./../src/image").image
var image_url = require("./../src/image_url").image_url

var socket = require('socket.io-client')('http://0.0.0.0:8080');

var responseObj = new Socket(socket);
var response ={ responseObj: responseObj, uid: "12345678910" };
var assert = require('assert');
describe('Image Search', function() {
  this.timeout(30000);
  describe('#validateRequest', function() {
    this.timeout(30000);
    describe('#invalidKeywords', function() {
	this.timeout(30000);
    	it('Request should contain comma or plus  separated keywords', function() {
    			assert.deepEqual(validateRequest("cat.dog","all","all",response),false);
        });
    });
    describe('#ValidKeywords', function() {
        this.timeout(30000);
        it('Request should contain comma or plus separated keywords', function() {
                        assert.deepEqual(validateRequest("cat,dog","all","all",response),true);
        });
    });
    describe('#ValidColor', function() {
        this.timeout(30000);
        it('Color can be one of the following colors [ "red,"blue",  "green", "yellow","black",  "orange", "violet", "brown","pink", "gray","all", "white","cyan" ]', function() {
                        assert.deepEqual(validateRequest("rose","red","all",response),true);
        });
    });
	describe('#InvalidColor', function() {
        this.timeout(30000);
        it('Color can be one of the following colors [ "red,"blue",  "green", "yellow","black",  "orange", "violet", "brown","pink", "gray","all", "white","cyan" ]', function() {
                        assert.deepEqual(validateRequest("rose","golden","all",response),false);
        });
      });
      describe('#InvalidType', function() {
        this.timeout(30000);
        it('Type can be one of the following  [ "all", "animals",  "architectures", "backgrounds",  "fashion",  "business", "communications", "education",  "emotions",  "food",  "drinks",  "medical", "industry", "music", "nature",  "people",  "places","religion",  "science", "sports", "transportation","travel" ]', function() {
                        assert.deepEqual(validateRequest("rose","red","things",response),false);
        });
    });
	describe('#ValidType', function() {
        this.timeout(30000);
        it('Type can be one of the following  [ "all", "animals",  "architectures", "backgrounds",  "fashion",  "business", "communications", "education",  "emotions",  "food",  "drinks",  "medical", "industry", "music", "nature",  "people",  "places","religion",  "science", "sports", "transportation","travel" ]', function() {
                        assert.deepEqual(validateRequest("rose","red","animals",response),true);
        });
    });



  });
});


