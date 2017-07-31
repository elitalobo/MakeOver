var async = require("async")
var server = require("./../server")
var image_url = require("./../image_url").image_url
var keys = [{ user: "0ddb0a36a812cb9d4444", password :"6c92ae6f9e574f4cf6f1ad2310bc39b5815307fc"}] // add more keys
var shutterstock = require("./shutterstock")
var Shutterstock = shutterstock.Shutterstock
var image = require('./../image').image

var Colors = { black : "#000000", gray : "#808080", silver: "#C0C0C0", white: "#FFFFFF", red: "#FF0000", yellow: "#FFFF00", green: "#008000", blue: "#0000FF", navy: "#000080", purple: "#800080", pink: "#FF00FF", brown: "#A52A2A", cyan : "#00ffff", orange: "#ffa500", violet: "#EE82EE" };
function getShutterstockImages(params, old_callback) {
	if(keys.length == 0)
		return;
	api_key = keys[0];
	keys.shift();
	keys.push(api_key);
	//console.log(api_key)
	var keywords = params.keywords;
	var parameters = {}
	parameters["query"] = keywords;
	if(params.hasOwnProperty("color") && params["color"]!="all") {
		parameters["color"]= Colors[params.color];
	}
	if(params.hasOwnProperty("height") && params["height"]!=0) {
		parameters["height_from"]=params["height"];
	}
	if(params.hasOwnProperty("width") && params["width"]!=0) {
		parameters["width_from"] = params["width"];
	}
	
	shutterstockObj = new Shutterstock(api_key);
	async.retry( {times:1, interval:1 }, function(callback, results) {
		 shutterstockObj.get(parameters, function(err, result){
			 if(err	!= null) { 
				//console.log(err);
				console.log(err);
    			 	callback(err, {result: null, old_callback: old_callback});
			 }
			 else {
				callback(null, {result: result, old_callback: old_callback} );
			}
		 
		})
		//console.log("called shutterstock");
	}, function(err, results) { saveShutterstockImages(err, results); } );
			
 	
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


function saveShutterstockImages(err, results) {
	var result = results.result;
        var callback = results.old_callback;
        if(err != null) {
		console.log("calling old callback ");
                callback(err,result);
                return;
        }
	var photos = []
	////console.log(result)
	var no_of_photos = result.data.length; // handle if data is not a property
	for(var photoId=0; photoId<no_of_photos; photoId++) {
			var shutterstockObj = result.data[photoId];
			if(shutterstockObj.hasOwnProperty("assets")) {
				var photo_urls = []
				if(shutterstockObj.assets.hasOwnProperty("preview")) {
					photo_urls.push(new image_url(shutterstockObj.assets["preview"]["url"], shutterstockObj.assets["preview"]["height"], shutterstockObj.assets["preview"]["width"]));
				
				}
				if(shutterstockObj.assets.hasOwnProperty("small_thumb")) {
                                	photo_urls.push(new image_url(shutterstockObj.assets["small_thumb"]["url"], shutterstockObj.assets["small_thumb"]["height"], shutterstockObj.assets["small_thumb"]["width"]));

                        	}
				if(shutterstockObj.assets.hasOwnProperty("large_thumb")) {
                                        photo_urls.push(new image_url(shutterstockObj.assets["large_thumb"]["url"], shutterstockObj.assets["large_thumb"]["height"], shutterstockObj.assets["large_thumb"]["width"]));

                                }
			}
			var tags = []
			if(shutterstockObj.hasOwnProperty("keywords")) {
				var keywords = shutterstockObj["keywords"];
				for(var idx=0;idx< keywords.length; idx++) {
					tags.push({ tagName: keywords[idx] });
				}
			}
			photos.push(new image("shutterstock",shutterstockObj["description"],tags, photo_urls));

		}
		console.log("Got images from shutterstock " + photos.length);	
		callback(err,photos);
	
	
			
		
}

module.exports.getShutterstockImages = getShutterstockImages
	
