
var restResponse = function(response) {
	this.response = response;
	this.reset();
}

restResponse.prototype.reset = function() {
        this.page_size = 50;
        this.page = 1 ;
	this.photos = []
	this.height = 0;
	this.width =0;
	this.processing_limit = Math.min(this.page_size,15)
}

restResponse.prototype.sendError = function(error_code, error_type, error_message, uid) {
	this.response.status(error_code)
        this.response.send({ error : { message : error_message , type: error_type }, status: "failed" }).end();
}

restResponse.prototype.gotProcessedImage = function(data) {
	var photos = data.processedPhotos;
	var image = data.processedImage;
	photos.push(image);
        return;
}

restResponse.prototype.gotProcessedImages = function(data) {
	console.log("function called");
        var photos = data.processedPhotos;
	var temp_photos = this.photos;
        var json_res  = JSON.stringify(photos);
        this.response.status(200);
        this.response.end("{ \"results\" : " + json_res + " , \"status\" : \"success\" }");
	data.processedPhotos=[]
	if(data.hasOwnProperty("sent_response")) {
		data["sent_response"]["start_response"]=true;
	}
	
        return;
}

restResponse.prototype.sendEndResponse = function(data) {
	console.log("function1 called");
	if(data.processedPhotos.length!=0)
		this.gotProcessedImages(data);
}

restResponse.prototype.sendNoImagesFoundResponse = function(data) {
	var uid = data.uid;
	this.response.status(200);
	this.response.end("{ \"results\" : " + "[]" + " , \"status\" : \"success\" }");
}


module.exports.restResponse = restResponse;

