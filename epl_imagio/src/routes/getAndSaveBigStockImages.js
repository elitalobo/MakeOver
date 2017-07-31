var error = require("./../error").error
var async = require("async")
var server = require("./../server")
var image_url = require("./../image_url").image_url
var keys = [{"account_id": "700193"}] // add more keys
var bigstock = require("./bigstock")
var BigStock = bigstock.BigStock
var image = require('./../image').image
var sizes = ["preview", "small_thumb"]

function getBigStockImages(params, old_callback) {
	var keywords = params.keywords;
	if(keys.length == 0)
		return;
	api_key = keys[0];
	keys.shift();
	keys.push(api_key);
	var parameters = {};
	parameters["q"] = keywords;
	bigstockObj = new BigStock(api_key);
	async.retry( {times:1, interval:1 }, function(callback, results) {
		 bigstockObj.get(parameters, function(err, result){
			 if(err	!= null) 
    			 	callback(err, {result: null, tags: keywords, old_callback: old_callback});
			 else {
				callback(null, {result: result, tags: keywords, old_callback: old_callback} );
			}
		 
	})}, function(err, results) { saveBigStockImages(err, results); } );
			
 	
}

function saveBigStockImages(err, results) {
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
	if(result.data == undefined) {
		callback(new error("result does not contain data " , "json_err", 500), result);
		return;
	}
	if(result.data.images== undefined) {
		callback(new error("result does not contain images ", "json_err", 500), result);
		return;
	}
	var no_of_photos = result.data.images.length;
	var photoObjs = result.data.images;
	for(var photoId=0; photoId<no_of_photos; photoId++) {
			var photo_urls = []
			var tags = []
			var photoObj = photoObjs[photoId];
			for(var cnt=0;cnt< common_tags.length;cnt++) {
				tags.push(common_tags[cnt]);
			}
			if(photoObj.keywords!=undefined) {
				var additional_keywords  = photoObjs[photoId].keywords.split(',');
				for(var idx=0;idx< additional_keywords.length; idx++) {
					tags.push({tagName: additional_keywords[idx] });
				}
			}
			for(var cnt=0;cnt< sizes.length; cnt++) {
				if(photoObj.hasOwnProperty(sizes[cnt])) {
					photo_urls.push(new image_url(photoObj[sizes[cnt]].url, photoObj[sizes[cnt]].height, photoObj[sizes[cnt]].width));
				}
			}
			photos.push(new image("bigstock",photoObjs[photoId].description,tags, photo_urls));
			//console.log(photo_urls.length);

	}
	callback(err,photos);
	
	
			
		
}

module.exports.getBigStockImages = getBigStockImages
	
