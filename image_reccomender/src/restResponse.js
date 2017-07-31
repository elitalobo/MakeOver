
var restResponse = function(response) {
	this.response = response;
	this.reset();
}

restResponse.prototype.reset = function() {
        this.domain_name = null;
	this.source_code = null;
	this.path = null;
	this.processing_limit = 15;
	this.photos = []
	this.response_status = null;	
}

restResponse.prototype.sendError = function(error_code, error_type, error_message) {
	this.response.status(error_code)
        this.response.send({ error : { message : error_message , type: error_type }, status: "failed" }).end();
}

restResponse.prototype.gotProcessedImage = function(data) {
	var photos = data.processedPhotos;
	var image = data.processedImage;
	photos.push(image);
        return;
}

restResponse.prototype.sendFinalResponse = function() {
	console.log("function called");
	var temp_photos = this.photos;
        var json_res  = JSON.stringify(temp_photos);
	var source_code = JSON.stringify(this.source_code);
	var path = JSON.stringify(this.path);
	console.log(path);
	console.log(this.path + "");
        this.response.status(200);
        this.response.end("{ \"results\" : " + json_res + "," +  "\"source_code\" : " + source_code + "," +  "\"path\" : " + path + " , \"status\" : \"success\" }");
	
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

