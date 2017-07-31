var getAndSaveFlickrImages = require("./getAndSaveFlickrImages")
var getAndSaveShutterstockImages = require("./getAndSaveShutterstockImages")
var getAndSaveUnsplashImages = require("./getAndSaveUnsplashImages")
var getAndSavePixabayImages = require("./getAndSavePixabayImages")
var getAndSaveBigStockImages = require("./getAndSaveBigStockImages")
var getAndSaveRf123Images = require("./getAndSaveRf123Images")
var getFlickrImages = getAndSaveFlickrImages.getFlickrImages
var getShutterstockImages = getAndSaveShutterstockImages.getShutterstockImages
var getUnsplashImages = getAndSaveUnsplashImages.getUnsplashImages
var getPixabayImages = getAndSavePixabayImages.getPixabayImages
var getBigStockImages = getAndSaveBigStockImages.getBigStockImages
var getRf123Images = getAndSaveRf123Images.getRf123Images
var sources = { /*"flickr" : getFlickrImages , */  "shutterstock": getShutterstockImages , "pixabay": getPixabayImages /*"unsplash": getUnsplashImages  ,  "bigstock": getBigStockImages ,"rf123": getRf123Images */ }
var process_sources = { /*"flickr": true */ "pixabay": true, "shutterstock": true, "unsplash": true, "bigstock": true , "rf123": true}
module.exports.sources = sources
module.exports.process_sources = process_sources

