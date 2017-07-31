var image = function(image_source, image_description, image_tags, image_urls) {
	
	this.urls = image_urls;
	this.description= image_description;
	this.tags = image_tags;
	this.source = image_source;
	this.colors = null;
	this.types = null;

}
module.exports.image = image


	
