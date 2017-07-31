var Socket = function(socket) {
	this.socket = socket;
	this.reset();
		
}

Socket.prototype.reset = function() {
        this.page_size = 6;
        this.page = 1 ;
	this.photos = [];
	this.height = 0;
	this.width = 0;
	this.processing_limit = Math.min(this.page_size,15)

}


Socket.prototype.sendError = function(error_code, error_message, error_type, uid) {
	this.socket.emit('got_error', { status_code: error_code, message: error_message, type: error_type, uid: uid });
}

Socket.prototype.gotProcessedImages = function(data) {
	var photos = data.processedPhotos;
	var uid = data.uid;
        this.socket.emit('gotImages', { images: photos, status_code: 200 , uid: uid});
	data["sent_response"]["start_response"]=true;
        return;
}

Socket.prototype.gotProcessedImage = function(data) {
	var uid = data.uid;
	this.socket.emit('gotImage', { image: data.processedImage, status_code: 200 , uid: uid});
	data["sent_response"]["start_response"] = true;
}

Socket.prototype.sendEndResponse = function(data) {
	var uid = data.uid;
	this.socket.emit('noMoreImages', { message: "No more images!", status_code: 200 , uid: uid } );
	data.processedPhotos = []
}

Socket.prototype.sendNoImagesFoundResponse = function(data) {
	var uid = data.uid;
	this.socket.emit('noImagesFound', { uid: uid, message: 'None of the images fetched matched requirements', status_code: 200 });
}

module.exports.Socket = Socket


