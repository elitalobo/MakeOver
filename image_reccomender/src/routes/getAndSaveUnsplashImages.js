var async = require("async")
var server = require("./../server")
var image_url = require("./../image_url").image_url
var keys = [{"client_id": "16cccf46947a164b23f5dce4778cd3177fbd1b718ee1ffed51e7bf4dad5b430e"}] // add more keys
var unsplash = require("./unsplash")
var Unsplash = unsplash.Unsplash
var image = require('./../image').image
var sizes = { small : 200, thumb: 400, regular: 1080 };
function getUnsplashImages(params, old_callback) {
	var keywords = params.keywords;
	var parameters = {}
	parameters["query"]= keywords;
	if(keys.length == 0)
		return;
	api_key = keys[0];
	keys.shift();
	keys.push(api_key);
	unsplashObj = new Unsplash(api_key);
	async.retry( {times:1, interval:1 }, function(callback, results) {
		 unsplashObj.get("photos.search", parameters , function(err, result){
			 if(err	!= null) 
    			 	callback(err, {result: null, tags: keywords, old_callback: old_callback});
			 else {
				callback(null, {result: result, tags: keywords, old_callback: old_callback} );
			}
		 
	})}, function(err, results) { saveUnsplashImages(err, results); } );
			
 	
}

function saveUnsplashImages(err, results) {
	var keywords = results.tags.split(',');
	var common_tags = [];
        for(var cnt=0; cnt < keywords.length;cnt++) {
		common_tags.push( { tagName: keywords[cnt] });
		//console.log(tags[cnt]);
	}
 	
	var result = results.result;
	var callback = results.old_callback;
	if(err != null) {
		callback(err,result);
		return;
	}
	var photos = []
	var no_of_photos = result.results.length;
	var photoObjs = result.results;
	for(var photoId=0; photoId<no_of_photos; photoId++) {
			var tags = []
			var photo_urls = []
			if(photoObjs[photoId].hasOwnProperty("urls")) {
				for(key in sizes) {
					if(photoObjs[photoId]["urls"].hasOwnProperty(key)) {
						photo_urls.push(new image_url(photoObjs[photoId]["urls"][key], sizes[key], sizes[key]));
					}
				}
			}
			if(photoObjs[photoId].hasOwnProperty("categories")) {
				var cat_len = photoObjs[photoId]["categories"].length;
				var categories = photoObjs[photoId]["categories"];
				for(var cnt=0;cnt< cat_len; cnt++) {
					if(categories[cnt].hasOwnProperty("title")) {
						tags.push({ tagName: categories[cnt]["title"]});
					}
				}
						
			}
			for(var cnt=0;cnt< common_tags.length; cnt++) {
				tags.push(common_tags[cnt]);
			}	
			photos.push(new image("unsplash",photoObjs[photoId].title,tags, photo_urls));
			//console.log(photo_urls.length);
			
	}
	callback(err,photos);
	
	
			
		
}

module.exports.getUnsplashImages = getUnsplashImages
	
