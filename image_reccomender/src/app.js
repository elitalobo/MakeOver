var express=require("express");
var app=express();
var process = require("child_process")
var logger = require("./routes/logger")
var request = require("request")
var GoogleVision = require("./routes/googlevision").GoogleVision
var async = require("async")
var Set = require("collections/set")

var extract_website_links =require("./feature_extractor").extract_website_links


var getSimilarImages = function(params, callback) {
	
        var async_queue = async.queue(function(task, callback) {
                var func = task["funct"];
                var parameters = task["parameters"];
                func(parameters, callback);
                return;
        },100);
         async_queue.drain  = function() {
                console.log("drain called\n");
		var set = new Set(params["photo"].photo.urls);
		params["photo"].photo.urls = set.toArray();
                callback(null, params["photo"]);
                return;
         }

                var cb = function(err, results) {
                                //console.log("****************************************");
                                //console.log(results);
                                //console.log("*****************************************");
                                if(err) {
                                        console.log(err);
                                        callback(err,null);
                                        return ;
                                }

                                return;
                }

                /*for(var cnt=0;cnt < photos.length; cnt++) {
                        var func = getSimilarImages;
                        async_queue.push( { funct : func , parameters : { photo: photos[cnt] }}, cb);
                        console.time("got_images")
                }*/

	params["photo"].photo.urls = [];
	var temp_keywords = "";
	console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
	console.log(params);
	console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
	var tags = params["photo"].photo.tags;
	var business_verticals = params["photo"].photo.business_verticals;
	console.log(business_verticals);
	var final_keywords = [];
	if((params["photo"].photo.image_id != "recommended") || business_verticals==null || business_verticals.length==0) {
		for(var idx=0;idx<tags.length;idx++) {
			if(idx!=0) {
				temp_keywords+=",";
			}
			temp_keywords+=tags[idx]["tagName"];
		}
		
		final_keywords.push(temp_keywords.replace(/\s/g,"+"));
	}
	else {
		for(var idx=0;idx<business_verticals.length;idx++) {
			temp_keywords = business_verticals[idx]["tagName"];
			for(var jdx=0;jdx< tags.length; jdx++) {
				final_keywords.push((temp_keywords + "," + tags[jdx]["tagName"].trim()).replace(/\s/g,"+"));
			}
		}
	}
	console.log(final_keywords);
	var getImagesFromImagio = function(parameters, callback) {
	var keywords = parameters["keywords"];
	console.log("Calling keywords " + keywords);
	request.get('http://127.0.0.1:8080/images/search?keywords=' + keywords + "&width="+ params["photo"].photo.width + "&height=" + params["photo"].photo.height ,
                                  { json: null },
                                  function (error, response, body) {
                                        console.log(error==null);
                                        var results = JSON.parse(body);
                                        if (error==null && results["status"]=="success") {
						var images = results["results"];
						//console.log(images);
						
						for(var cnt=0;cnt< images.length; cnt++) {
							var image = images[cnt];
							//console.log(image);	

							params["photo"].photo.urls.push(image["urls"][0].url);
							//final_urls.push(image["urls"][0].url);
						}
						//console.log(params["photo"].photo.urls);
                   				callback(null, params["photo"].photo.urls);

                                        }
                                        else {
						
						console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Error");
						console.log(error);
						console.log("http://127.0.0.1:8080/images/search?keywords=" + keywords + "&width="+ params["photo"].photo.width + "&height=" + params["photo"].photo.height);
						if(error==null) {
							callback(null,params["photo"].photo.urls);
						}
						else {
                                                	callback(error,null);
						}
                                        }
                                   });
	}
	for(var idx=0;idx<final_keywords.length;idx++) {
		async_queue.push({funct : getImagesFromImagio  , parameters : { keywords : final_keywords[idx] }}, cb);
	}
}


var getImagesFromSource = function(photos, callback) {
	var final_photos = []
	var async_queue = async.queue(function(task, callback) {
                var func = task["funct"];
                var params = task["parameters"];
                func(params, callback);
                return;
	},100);
	 async_queue.drain  = function() {
		console.log("drain called\n");
		callback(null, final_photos);
                return;
         }

                var cb = function(err, results) {
				console.log("****************************************");
				//console.log(results);
				console.log("*****************************************");
                                if(err) {
                                        console.log(err);
					callback(err,null);
                                        return ;
                                }
                                
					final_photos.push(results.photo);
					
				
                                return;
                }

                for(var cnt=0;cnt < photos.length; cnt++) {
                        var func = getSimilarImages;
		        async_queue.push( { funct : func , parameters : { photo: photos[cnt] }}, cb);
			console.time("got_images")
                }
}

	

var request_handler = function(req,responseObj){
		var res = responseObj.response;
		console.log("received request");
		/*process.exec('seq 1 | parallel -n0 casperjs worker.js '+ req.q, (error, stdout, stderr) => {
			logger.log('info', "got stdout ", { domain: req.q , stdout : stdout });
  			if (error) {
 				   console.error(`exec error: ${error}`);
				   res.status(503);
				   res.send({"error": error }).end();
				   	logger.log('info',  "Got error " , { domain: req.q, error: error } );
    				return;
  			}
			else if(stdout.indexOf("Exiting")!=-1) {
				res.status(503);
				return;
			}
			else {*/
				
				var extract_website_drain = function(results) {
				console.log(results.success);
				console.log(results["success"]);
				//console.log(results["details"]["source_code"]);	
				if(results == null || results.success == false ) {
					responseObj.response.status(400);
					responseObj.response.send({"error": "Could not extract features from site: " + req.q }).end();
					logger.log('info', "Could not extract features from site : " + req.q)
					return;
				}
			
				responseObj.source_code = results["details"]["source_code"];
				responseObj.domain_name = req.q;
				responseObj.path = results["details"]["path"];
				var photos = results["details"]["photos"];
				//console.log(photos);
			        var queue = async.queue(function(task, callback) {
               			 var func = task["func"];
				var final_photos = task["photos"];
                		func(final_photos, callback);
                		return;
				},100);
				queue.drain  = function() {
					getImagesFromSource(responseObj.photos, getImagesFromSourceCallback);
					return;
				}
				
				var getImagesFromSourceCallback = function(err, photos) {
					if(err) {
						console.log(err);
						if(responseObj.response_status!=null) {
							responseObj.sendError(500,"similar_images_not_found", err);
							responseObj.response_status = "SENT";
						}
						
						return;
					}
					responseObj.photos = photos;
					responseObj.sendFinalResponse();
				}
				var photos_not_processed_callback= function(err, resultImage) {
					responseObj.photos.push(resultImage);
				}
				var doNothing = function(results, callback) {
					console.log(results);
					callback(null,results[0]);
				}
				var photos_processed_callback = function(err, resultImages) {
								for(var cnt=0;cnt<resultImages.length;cnt++) {	
										console.log("Processed image start");
										console.log(resultImages[cnt]);		
										responseObj.photos.push(resultImages[cnt]);
								}

                                }
				var vision = new GoogleVision();
				for(var cnt=0;cnt<photos.length;cnt+=responseObj.processing_limit) {
					var photos_to_be_processed = [];
					var photos_not_to_be_processed = [];
					
						for(var idx =0;idx< responseObj.processing_limit && cnt + idx < photos.length;idx++) {
							if(photos[cnt+idx].url!=null && photos[cnt+idx].height!=0 && photos[cnt+idx].width!=0) {
								photos_to_be_processed.push({ photo: photos[cnt+idx], idx: cnt+idx });
							}
							else {
								photos_not_to_be_processed.push({ photo: photos[cnt+idx]});
							}
							
						}
				
				
					
					if(photos_to_be_processed.length!=0) {
						console.log("Vision would be processing these images ######################### + " + responseObj.processing_limit);
			
						console.log("Thats all");	
                					queue.push({ func : function(photos,  callback) {
                        	        			vision.processImages(photos, callback) } ,  photos: photos_to_be_processed } , photos_processed_callback);
					}
					if(photos_not_to_be_processed.length!=0) {
						console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
						console.log(photos_not_to_be_processed);
						console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
						queue.push({ func : function(photos, callback) {
								doNothing(photos,callback) }, photos: photos_not_to_be_processed }, photos_not_processed_callback);
					}	
				}
				}
				results = extract_website_links("data",req.q, extract_website_drain);		
			
				
			//}
			//res.send({ stdout: stdout , stderr: stderr }).end();
  			
		//});
	


}


module.exports.request_handler = request_handler
