var image = function(image_id, image_url, height, width) {
	
	this.image_id = image_id;
	this.url = image_url;
	this.height = height;
	this.width =  width;
	this.tags = [];
	this.urls = [];
	this.local_url = null;
	this.business_verticals = []
}
module.exports.Image = image


	
