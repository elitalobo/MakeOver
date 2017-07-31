var path = require("path")
https = require('https')
fs = require('fs');
var logger = require("./logger")
var error = require("./../error").error
var path_to_keyfile = "data/Imagio-f5b5639e85be.json";
var project_id = require("./config").config.project_id
var async = require("async")
var Type = require("./Type").Type
var Color = require("./ColorUtils").Color
var colorutils = require("./ColorUtils")

var GoogleVision = function() {
    this.vision = require('@google-cloud/vision')({
  	projectId: project_id,
  	keyFilename: path_to_keyfile
	});
    
    console.log(this.vision);

     
};

GoogleVision.prototype.getDetails = function(photos, file_paths, old_callback) {
    var details = {}
    var queue = async.queue(function(task, callback) {
                task.func(callback);
	},100);
    
    queue.drain = function() {
		console.timeEnd("ProcessedBatch")
		processDetails(photos,details, old_callback);
		return;
    }
    
    var cb = function(err, result) {
	
	if(err){
		console.log(err);
		return;
	}
	details[result.detailType] = result.details;
	return;
    }
    console.time("ProcessedBatch")
    var vision = this.vision; 
    queue.push({ func: function (callback) {
    	vision.detectProperties(file_paths, function(err, detections, apiResponse) {
	console.log("**********************************************************************************");
	if(err) {
		console.log(JSON.stringify(err));
	}
	else {
		console.log(JSON.stringify(err));
	}
	if(detections) {
	
		console.log(JSON.stringify(detections));
	}
	else {
		console.log("no detections");
	}
	if(apiResponse) {
		console.log(JSON.stringify(apiResponse));
	}
	else {
		console.log("no api response");
	}
	
    	if (err || apiResponse==null || apiResponse==undefined  ) {
		 logger.log('error',"Request Id: " + " Got error while detecting image properties. ",err);
		 callback(err, null);
	
    	} else {
     				
			logger.log('info', "Request Id: " +" Got image properties from Google Vision ", apiResponse);
			callback(null , { detailType: "imageProperties", details: apiResponse } );
		}
	
    	});
	} }, cb);
	queue.push({ func: function(callback) {
   		vision.detectLabels(file_paths, function(err, detections, apiResponse) {
		if(err) {
			logger.log('error', "Request Id: " + " Got image properties from Google Vision " , apiResponse);
			callback(err, null);
		
		} else {
			logger.log('info', "Request Id: " + " Got image labels from Google Vision ", apiResponse);
			callback(null , { detailType: "Labels", details: apiResponse } );
			}
    		});
	}} , cb);
		
	
}

	


function getColors(details, idx) {
	var palette = [];
	
	if(details== null)
		return palette;
	var ColorUtils = new colorutils.ColorUtils();
	
	if(details.hasOwnProperty("responses")) {
		details = details["responses"];
		if(details.length<=idx)
			return palette;
		details = details[idx];
	if(details.hasOwnProperty("imagePropertiesAnnotation")) {
		var imageProperties = details["imagePropertiesAnnotation"];
		if(imageProperties.hasOwnProperty("dominantColors")) {
			var dominantColors = imageProperties["dominantColors"];
			if(dominantColors.hasOwnProperty("colors")) {
					var dominantcolors = dominantColors["colors"];
				for (var colorObj in dominantcolors){
					if(dominantcolors[colorObj].hasOwnProperty("color")){
						var color = dominantcolors[colorObj]["color"];	
						var red =  parseInt(color["red"]);
						var blue = parseInt(color["blue"]);
						var green = parseInt(color["green"]);
						
						palette.push(new Color(ColorUtils.getColorNameFromRgb(red,green,blue),red,green, blue));
					}
				}
			}
		}
	}
	}
	return palette;
	
}

function getTypes(details, idx) {
	// extract type from details
	var types = []
	if(details==null) 
		return types;
	if(details.hasOwnProperty("responses")) {
		details = details["responses"];
		if(details.length<=idx)
			return types;
		details = details[idx];
	if(details.hasOwnProperty("labelAnnotations")) {
		var labelAnnotations = details["labelAnnotations"];
		for(var cnt=0;cnt < labelAnnotations.length;cnt++) {
			var type = labelAnnotations[cnt];
			types.push(new Type(type.description, type.score));
		}
	}
	}
	return types;
}

function processDetails(photos,details, callback) {
	if(details == null) {
		return callback(new error("Could not get details of image"), null);
	}
	for(var idx=0;idx<photos.length;idx++) {
		photos[idx].photo.colors = []
		photos[idx].photo.types = []
		if(details.hasOwnProperty("imageProperties")) {
			photos[idx].photo.colors = getColors(details["imageProperties"], idx);
		}
		if(details.hasOwnProperty("Labels")) {
			photos[idx].photo.types = getTypes(details["Labels"], idx);
			if(photos[idx].photo.tags==undefined) {
                                photos[idx].photo.tags=[];
                        }
                        for(var cnt =0; cnt< photos[idx].photo.types.length;cnt++) {
                                photos[idx].photo.tags.push({ "tagName": photos[idx].photo.types[cnt].type});
                        }

		}
	}
	return callback(null, photos);
}

GoogleVision.prototype.processImages = function(photos,callback) {
	var urls = []
	console.log("Called processImages ");
	for(var cnt=0;cnt<photos.length;cnt++){
		urls.push(photos[cnt].photo.url);
		console.log(cnt + " " + photos[cnt].photo.url);
	}
	console.log("done");
	this.getDetails(photos,urls,callback);
}

module.exports.GoogleVision = GoogleVision
