var error = require("./../error").error
var async = require("async")
var server = require("./../server")
var image_url = require("./../image_url").image_url
var keys = [{"api_key": "9a550463ec9af9a476a7224f371584cb"}] // add more keys
var rf123 = require("./rf123")
var Rf123 = rf123.Rf123
var image = require('./../image').image
var sizes = { "thumbnails" : { width: 150, height: 100 } , "compings_v2": { width: 450, height: 250 } }

function getRf123Images(params, old_callback) {
	var keywords = params.keywords;
	if(keys.length == 0)
		return;
	api_key = keys[0];
	keys.shift();
	keys.push(api_key);
	var parameters = {};
	parameters["keyword"] = keywords;
	rf123Obj = new Rf123(api_key);
	async.retry( {times:1, interval:1 }, function(callback, results) {
		 rf123Obj.get(parameters, function(err, result){
			 if(err	!= null) 
    			 	callback(err, {result: null, tags: keywords, old_callback: old_callback});
			 else {
				callback(null, {result: result, tags: keywords, old_callback: old_callback} );
			}
		 
	})}, function(err, results) { saveRf123Images(err, results); } );
			
 	
}

function saveRf123Images(err, results) {
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
	if(result.image == undefined) {
		callback(new error("result does not contain images ", "json_err", 500), result);
		return;
	}
	var no_of_photos = result.image.length;
	var photoObjs = result.image;
	for(var photoId=0; photoId<no_of_photos; photoId++) {
			var photo_urls = []
			var photoObj = photoObjs[photoId];
			if(!photoObj.hasOwnProperty("_attributes")) {
				continue;
			}
			photoObj = photoObjs[photoId]._attributes;
			for(var key in sizes) {
				if(photoObj.hasOwnProperty("contributorid") && photoObj.hasOwnProperty("folder") && photoObj.hasOwnProperty("filename")) {
					var url = "http://images.assetsdelivery.com/" + key + "/" +  photoObj["contributorid"] + "/" + photoObj["folder"] + "/" + photoObj["filename"] + ".jpg";
					photo_urls.push(new image_url( url, sizes[key].height, sizes[key].width));
				}
			}
			photos.push(new image("rf123",photoObj.description,common_tags, photo_urls));
			//console.log(photo_urls.length);

	}
	callback(err,photos);
	
	
			
		
}

module.exports.getRf123Images = getRf123Images
	
