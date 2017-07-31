var async = require("async")
var server = require("./../server")
var image_url = require("./../image_url").image_url
var keys = [{"api_key": "3433404-7d00bd9f1cf9fd0f94a33f4b7"}] // add more keys
var pixabay = require("./pixabay")
var Pixabay = pixabay.Pixabay
var image = require('./../image').image

function getPixabayImages(params, old_callback) {
	if(keys.length == 0)
		return;
	var keywords = params.keywords;
	api_key = keys[0];
	keys.shift();
	keys.push(api_key);
	var parameters = {}
	parameters["q"] = keywords;
	if(params.hasOwnProperty("type") && params["type"]!="all") {
		parameters["category"]= params.type;
	}
	 if(params.hasOwnProperty("height") && params["height"]!=0) {
                parameters["min_height"]=params["height"];
        }
        if(params.hasOwnProperty("width") && params["width"]!=0) {
                parameters["min_width"] = params["width"];
        }

	pixabayObj = new Pixabay(api_key);
	async.retry( {times:1, interval:1 }, function(callback, results) {
		 pixabayObj.get(parameters, function(err, result){
			 if(err	!= null) {
				console.log("got error"); 
    			 	callback(err, {result: null, old_callback: old_callback});
			 }
			 else {
				callback(null, {result: result, old_callback: old_callback} );
			}
		 
	})}, function(err, results) { savePixabayImages(err, results); } );
			
 	
}

function getTags(keywords) {
	tags = []
	final_keys = keywords.split(',')
	for(var cnt=0;cnt< final_keys.length;cnt++) {
		var temp = final_keys[cnt].trim();
		if(temp!="") {
			tags.push( { tagName: temp } );
		}
	}
	return tags;
}


function savePixabayImages(err, results) {
	var result = results.result;
        var callback = results.old_callback;
        if(err != null) {
                callback(err,result);
                return;
        }
	var photos = []
	//////console.log(result)
	var no_of_photos = result.hits.length;
	for(var photoId=0; photoId<no_of_photos; photoId++) {
			var pixabayObj = result.hits[photoId];
			var photo_urls = []
			if(pixabayObj.hasOwnProperty("previewURL")) {
				photo_urls.push(new image_url(pixabayObj["previewURL"], pixabayObj["previewHeight"], pixabayObj["previewWidth"]));
				
			}
			if(pixabayObj.hasOwnProperty("webformatURL")) {
                                photo_urls.push(new image_url(pixabayObj["webformatURL"], pixabayObj["webformatHeight"], pixabayObj["webformatWidth"]));

                        }
			var tags = []
			if(pixabayObj.hasOwnProperty("tags")) {
				tags = getTags(pixabayObj["tags"]);
			}
			photos.push(new image("pixabay",pixabayObj["tags"],tags, photo_urls));
			//////console.log(photo_urls.length);

	}
	console.log("Got images from pixabay " + photos.length);
	callback(err,photos);
	
	
			
		
}

module.exports.getPixabayImages = getPixabayImages
	
