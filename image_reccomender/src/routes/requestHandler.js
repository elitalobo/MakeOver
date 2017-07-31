var logger = require("./logger")
var async = require("async")
var sources = require("./sources").sources
var process_sources = require("./sources").process_sources

var colors = { red : "red", blue : "blue", green: "green", yellow: "yellow", black: "black", orange: "orange", violet: "violet", brown: "brown", pink: "pink", gray : "gray", all: "all",  white: "white", cyan: "cyan" };

var types = { all : "all", animals : "animals", architectures: "architectures", backgrounds: "backgrounds", fashion: "fashion", business: "business", communications : "communications", education : "education", emotions : "emotions", food: "food", drinks: "drinks", medical: "medical", industry: "industry", music : "music", nature: "nature", people : "people", places : "places", religion: "religion", science : "science", sports: "sports", transportation : "transportation", travel : "travel" };


var GoogleVision = require("./googlevision").GoogleVision
var cache = require("./cache").cache

function isAlphaNumeric(x) {
  if((x>='A'&&x<='Z')||(x>='a'&&x<='z')||(x>='0'&&x<='9'))
	return true;
  return false;
}

var validate = function(keywords) {
	if(keywords == null || keywords == "" || keywords.length == 1)
		return false;
	for(var cnt = 0 ; cnt< keywords.length; cnt++) {	
		if(!((keywords[cnt]==',' && cnt!=0) || isAlphaNumeric(keywords[cnt])|| (keywords[cnt]=='+'))) {
       			return false;
		}
	}
	return true;
}


function alter(keywords) {
                var final_keys = "";
                for(cnt=0;cnt<keywords.length;cnt++) {
                        if(keywords[cnt]==' ') {
                                final_keys+= '+';
                        }
                        else if(keywords[cnt]>='A' && keywords[cnt]<='Z') {
                                final_keys += keywords[cnt]-'A' + 'a';
                        }
                        else {
                                final_keys += keywords[cnt];
                        }
                }
                return final_keys;
}

function validColor(color) {
	if(colors.hasOwnProperty(color)) {
		return true;
	}
	return false;
}


function validType(type) {
	if(types.hasOwnProperty(type)) {
		return true;
	}
	return false;
}

	
function validPageSize(page_size) {
	if(page_size>=1 && page_size<=50) {
		return true;
	}
	return false;
}

function validPage(page) {
	if(page>=1 && page<=5) {
		return true;
	}
	return false;
}

	
function validateRequest(keywords,color, type, response) {
	logger.log('info', "Request Id: " + response.uid + " Validating request ", null);
	var responseObj = response.responseObj;
	var uid = response.uid;
	if(!validPageSize(responseObj.page_size)) {
		logger.log('error', "Request Id: " + uid + " Invalid page size!");
		responseObj.sendError(400, "Invalid Page Size!", "Bad Request!", uid);
                return false;
        }
        if(!validPage(responseObj.page)) {
		logger.log('error', "Request Id: " + uid + " Invalid Page no! ");
		responseObj.sendError(400, "Invalid Page No!", "Bad Request!", uid);
                return false;
        }
        if(!validate(keywords)) {
		logger.log('error', "Request Id: " + uid + " Invalid keywords");
		responseObj.sendError(400, "Invalid keywords", "Bad Request!", uid);
                return false;
        }
         if(!validColor(color)) {
		logger.log('error', "Request Id: " + uid + " Invalid Color");
		responseObj.sendError(400, "Invalid Color", "Bad Request!", uid);
		return false;
         }

         if(!validType(type)) {
		logger.log('error', "Request Id: " + uid + " Invalid Type");
		responseObj.sendError(400, "Invalid Type", "Bad Request!", uid);
		return false;
         }
	return true;
}

module.exports.validateRequest = validateRequest
 

exports.handle_requests =  function(requestObj,responseObj,uid) {
	console.time("request_handled")
	
	if(!("keywords" in requestObj)){
		logger.log('error', "Request Id: " + uid + " No keywords found! ");
		responseObj.sendError(400, "No keywords found!", "Bad Request!", uid);
		return;
	}
	
	var keywords = String(requestObj.keywords);
	
	var color = "all";
	if(Object.prototype.hasOwnProperty.call(requestObj, "color")) {
		color = String(requestObj.color);
	}
	
	var type = "all";
	var width = requestObj.width;
	var height = requestObj.height;
	if(Object.prototype.hasOwnProperty.call(requestObj, 'type')) {
		type=String(requestObj.type);
	}
	
	responseObj.reset();
	if(Object.prototype.hasOwnProperty.call(requestObj, 'page_size')) {
		responseObj.page_size = requestObj.page_size;   // reset page_size and page after sending response 
	}
	
	if(Object.prototype.hasOwnProperty.call(requestObj, 'page')) {
		responseObj.page = requestObj.page;
	}
	
	if(Object.prototype.hasOwnProperty.call(requestObj, 'height')) {
                responseObj.height = requestObj.height;
        }
	if(Object.prototype.hasOwnProperty.call(requestObj, 'width')) {
                responseObj.width = requestObj.width;
        }

        keywords = alter(keywords);
	
	if(!validateRequest(keywords, color, type, { responseObj: responseObj, uid: uid } )) {
		return;
	}
	
	
	if(color!="all") {
		keywords += "," + color;
	}
	if(type!="all") {
		keywords += "," + type;
	}
	logger.log('info', "Request Id " + uid + " Keywords " + keywords + " Color: " + color + " Type: " + type);
         var present_in_cache = checkCacheForImages(keywords, color, type);
	 if(!present_in_cache || (width!=0 || height!=0) ) {
		logger.log('info', "Request Id: " + uid + " Getting images from cache"); 
		getImagesFromSource(keywords,color,type,width, height ,{ responseObj: responseObj, uid: uid} );
		
	}
	else {
		logger.log('info', "Request Id: " + uid + " Getting images from source");
		getImagesFromCache(keywords,color,type, { responseObj : responseObj, uid: uid } );
	}
	
}

function checkCacheForImages(keywords, color, type) {
	
	if(String(cache.get(keywords + "-" + color + "-" + type))!="undefined") {
		return true;
	}
	return false;
}

module.exports.checkCacheForImages = checkCacheForImages

// sort keywords 
function getImagesFromCache(keywords, color, type, response) {
	var key = keywords + "-" + color + "-" + type;
	var responseObj = response.responseObj;
	var uid = response.uid;	
	var photos = response.responseObj.photos;
	var temp_photos = cache.get(key)
	for(var cnt=0;cnt<temp_photos.length;cnt++) {
		photos.push(temp_photos[cnt]);
	}
	var sent_response = {}
	sent_response["start_response"]=false;
	var index=0;
        var start = (responseObj.page_size)*(responseObj.page-1);
        var end = (responseObj.page_size)*(responseObj.page);
	var processedImages = []
	for(var idx=start; idx<=end && idx<photos.length;idx++) {
		responseObj.gotProcessedImage({ uid: uid, processedPhotos: processedImages, processedImage: photos[idx], sent_response: sent_response });
	}
	 if(!sent_response["start_response"] && processedImages.length==0) {
				logger.log('warn', "Request Id: " + uid + " Did not find images that meet the users requirements");
                                responseObj.sendNoImagesFoundResponse({ uid: uid });
				return;
         }
         responseObj.sendEndResponse( { uid: uid, processedPhotos: processedImages });
         logger.log('info', "Request Id: " + uid + " Got images from cache ");

}

module.exports.getImagesFromCache = getImagesFromCache

function getImagesFromSource(keywords, color, type, width, height, response, callback) {
	 var responseObj = response.responseObj;
	 var photos = responseObj.photos;
	 var uid = response.uid;
	 var async_queue = async.queue(function(task, callback) {
                var func = task["funct"];
                var params = task["parameters"];
                func(params, callback);
                return;
	},100);
	 async_queue.drain  = function() {
		if(photos.length==0) {
			logger.log('error', "Request Id: " + uid + " No images were returned by sources! Check keywords");
			responseObj.sendError(400, "No images were returned by sources! Check keywords!", "Bad Request",uid);
			return;
		}
		logger.log('info', "Request Id: " + uid + " Got images from sources ", { total_no_of_images: photos.length } );
                processImages(keywords,color,type,response);
		if(callback!=undefined) {
			callback();
		}
                return;
         }

                var cb = function(err, results) {
                                if(err) {
                                        addErrors(photos,err);
                                        return;
                                }
                                addImages(photos, results);
                                return;
                }

                for(var source in sources) {
                        var func = sources[source];
		        async_queue.push( { funct : func , parameters : { keywords : keywords , color: color, type: type, width: width, height: height }}, cb);
			console.time("got_images")
                }

}

module.exports.getImagesFromSource = getImagesFromSource

function getOrderedImages(photos) {

        var slen = Object.keys(sources).length;
        var _sources = Object.keys(sources);
        var temp_images = {}
        for(var cnt=0;cnt<slen;cnt++) {
                temp_images[_sources[cnt]]=[];
        }
        var max_photos =0;
        for(var cnt=0;cnt<photos.length;cnt++) {
                temp_images[photos[cnt].source].push(photos[cnt]);
                max_photos = Math.max(temp_images[photos[cnt].source].length, max_photos);
        }
        var ordered_photos = []
        for(var cnt=0;cnt<max_photos;cnt++) {
                for(var idx = 0;idx<slen;idx++) {
                        if(cnt<temp_images[_sources[idx]].length) {
                                ordered_photos.push(temp_images[_sources[idx]][cnt]);
                        }
                }
        }
        console.log("Get ordered images\n");
        for(var idx=0; idx < ordered_photos.length; idx++) {
                console.log(idx);
                console.log(ordered_photos[idx].urls);
                console.log("\n");
        }
	
        return ordered_photos;
}

module.exports.getOrderedImages = getOrderedImages

var sendFinalResponse =  function(responseObj,sent_response, processedImages, uid) {
	console.timeEnd("processingImages")
                if(!sent_response["start_response"] && processedImages.length==0) {
                                logger.log('info', "Request Id: " + uid + " Did not find images that match user's requirements");
                                responseObj.sendNoImagesFoundResponse({ uid: uid });
                }
                else {
                        logger.log('info', "Request Id: " + uid + "Sending processed images to users ", { total_no_of_images : processImages.length});
                        responseObj.sendEndResponse( { uid: uid, processedPhotos: processedImages });
                }
		sent_response["end_response"]=true;
}

function processImages(keywords, color, type, response, callback) {
	var responseObj = response.responseObj;
	var uid = response.uid;
	responseObj.photos = getOrderedImages(responseObj.photos);
	
	var photos = responseObj.photos;
	var key = keywords + "-" + color + "-" + type;
	var sent_response = {}
	sent_response["start_response"]=false;
	sent_response["end_response"] = false;
	var processedImages = []
	var vision = new GoogleVision();
	var index=0;
	var start = (responseObj.page_size)*(responseObj.page-1);
	var end = (responseObj.page_size)*(responseObj.page);
	var queue = async.queue(function(task, callback) {
                var func = task["func"];
                var uid = task["uid"];
		var photos = task["photos"];
                func(photos, uid, callback);
                return;
        },100);

	queue.drain  = function() {
		if(!sent_response["end_response"]) {
			sendFinalResponse(responseObj,sent_response,processedImages,uid);
		}
		if(callback!=undefined) {
			callback();
		}
		return;
	}
	var photos_processed_callback = function(err, resultImages) {
                  		if(err) {
                                       return;

                                }
                                else {
                                      if(resultImages != null) {
                                         	for(var id = 0; id < resultImages.length; id++) {
                                                    var resultImage = resultImages[id].photo;
                                                    if(resultImage != null && (color == "all"|| IsColorIncluded(resultImage.colors, color) && IsTypeIncluded(resultImage.types, type)))
                                                    {
                                                          if(index>=start && index<end) {
                                                               responseObj.gotProcessedImage({ uid: uid, processedImage:resultImage, processedPhotos: processedImages, sent_response : sent_response });


                                                    	   }
                                                           index += 1;
                                                           logger.log('info', "Request Id: " + uid + " Adding image to cache ", resultImage);
                                                           addImageToCache(key, resultImage);
							   if(index==end && !sent_response["end_response"]) {
								sendFinalResponse(responseObj,sent_response,processedImages,uid);
							   }
                                                    }
                                                           photos[resultImages[id].idx] = resultImages[id].photo;
								
                                            	}

                                     }
                                }

	}
	var photos_not_processed_callback = function(err, resultImages) {
                                                if(err) {
                                                        return;

                                                }
                                                else {
                                                        for(var id =0; id < resultImages.length;id++) {
                                                                if(resultImages[id]!=null) {
                                                                        if(index >= start && index < end) {
                                                                                responseObj.gotProcessedImage({ uid: uid, processedImage:resultImages[id].photo, processedPhotos: processedImages, sent_response : sent_response });

                                                                        }
                                                                        index+=1;
									 if(index==end && !sent_response["end_response"]) {
		                                                                sendFinalResponse(responseObj,sent_response,processedImages,uid);
                		                                          }

                                                                        logger.log('info', "Request Id: " + uid + " Adding image to cache ", resultImages[id]);
                                                                        addImageToCache(key, resultImages[id].photo);
                                                                }
                                                                photo[resultImages[id].idx] = resultImages[id].photo;


                                                        }
                                                }
	}
	console.time("processingImages " + responseObj.page_size/2)
	console.time("first_process")
        for(var cnt=0;cnt<photos.length;cnt+=responseObj.processing_limit) {
		var photos_to_be_processed = []
		var photos_not_to_be_processed  = []
		for(var idx =0;idx< responseObj.processing_limit && cnt + idx < photos.length;idx++) {
			//console.log("%%%%%%%%%%% ");console.log(photos[cnt+idx].urls); console.log(" %%%%%%%%%%%%%%%");
			if(!process_sources[photos[cnt+idx].source]){
				photos_not_to_be_processed.push({ photo: photos[cnt+idx], idx: cnt+idx } );
			}
			else {
				//console.log("to be processed");
				photos_to_be_processed.push({ photo: photos[cnt+idx], idx: cnt+idx });
			}
		}
		
		if(photos_to_be_processed.length!=0) {
			console.log("Vision would be processing these images ######################### + " + responseObj.processing_limit);
			for(var x=0;x < photos_to_be_processed.length; x++) {
				console.log(x);
				console.log(photos_to_be_processed[x].photo.urls[0]);
			}
			console.log("Thats all");	
                	queue.push({ func : function(photos, uid, callback) {
                        	        vision.processImages(photos,uid, callback) } , uid: uid, photos: photos_to_be_processed } , photos_processed_callback);
		}
		if(photos_not_to_be_processed.length!=0) {
			queue.push({ func: function(photos, uid, callback) {
                                        fillDetails(photos,color,type,callback) }, uid: uid, photos: photos_not_to_be_processed } , photos_not_processed_callback);
		}
	}
        
}

module.exports.processImages = processImages

function fillDetails(photos,color,type,callback) {
		for(var idx=0;idx<photos.length;idx++) {
			photos[idx].photo.colors = color;
			photos[idx].photo.types = type;
		}
		callback(null, photos);
}


function IsColorIncluded(colors, color) {
	if(color=="all")
		return true;
	for(var cnt=0;cnt<colors.length;cnt++) {
		if(colors[cnt].name == color) {
			return true;
		}
	}
	return false;
}

function IsTypeIncluded(types, type) {
	if(type=="all")
		return true;
	for(var cnt=0;cnt<types.length;cnt++) {
		if(types[cnt].type == type) {
			return true;
		}
	}
	return false;
}


function addImageToCache(key, resultImage) {
	var imageList = cache.get(key);
	if(imageList == undefined) {
		value = [];
	}
	value.push(resultImage);
	cache.set(key, value);
}

module.exports.addImageToCache = addImageToCache

function addImages(photos, results) {
	if(results.length==0)
		return;
	for(var cnt=0;cnt< results.length;cnt++) {
		photos.push(results[cnt]);
	}
}

function addErrors(photos, error, source) {
	if(error == null)
		return;
	console.log(error);
	// should this error be emitted ? 
}


