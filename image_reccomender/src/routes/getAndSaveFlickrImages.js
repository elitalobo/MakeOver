var async = require("async")
var server = require("./../server")
var image_url = require("./../image_url").image_url
var keys = [{"api_key": "9226002e79b8fd8f7afd5c45584e79e7"}] // add more keys
var flickr = require("./flickr")
var Flickr = flickr.Flickr
var image = require('./../image').image
var sizes = { /*url_c : 800, url_l : 1024, url_m : 500, url_z : 640, url_o : 1080, */ url_sq: 75, url_s : 240, url_q : 150, url_t : 100, url_n :320 }

function getFlickrImages(params, old_callback) {
	var keywords = params.keywords;
	if(keys.length == 0)
		return;
	api_key = keys[0];
	keys.shift();
	keys.push(api_key);
	var parameters = {};
	parameters["tags"] = keywords;
	flickrObj = new Flickr(api_key);
	async.retry( {times:1, interval:1 }, function(callback, results) {
		 flickrObj.get("photos.search", parameters, function(err, result){
			 if(err	!= null) 
    			 	callback(err, {result: null, tags: keywords, old_callback: old_callback});
			 else {
				callback(null, {result: result, tags: keywords, old_callback: old_callback} );
			}
		 
	})}, function(err, results) { saveFlickrImages(err, results); } );
			
 	
}

function saveFlickrImages(err, results) {
	var keywords = results.tags.split(',');
	var tags = [];
        for(var cnt=0; cnt < keywords.length;cnt++) {
		tags.push( { tagName: keywords[cnt] });
		//console.log(tags[cnt]);
	}
 	
	var result = results.result;
	var callback = results.old_callback;
	if(err != null) {
		callback(err,result);
		return;
	}
	var photos = []
	var no_of_photos = result.photos.photo.length;
	var photoObjs = result.photos.photo;
	for(var photoId=0; photoId<no_of_photos; photoId++) {
			var photo_urls = []
			for(var key in sizes) {
				if(photoObjs[photoId].hasOwnProperty(key)) {
					photo_urls.push(new image_url(photoObjs[photoId][key], sizes[key], sizes[key]));
				}
			}
			photos.push(new image("flickr",photoObjs[photoId].title,tags, photo_urls));
			//console.log(photo_urls.length);

	}
	callback(err,photos);
	
	
			
		
}

module.exports.getFlickrImages = getFlickrImages
	
