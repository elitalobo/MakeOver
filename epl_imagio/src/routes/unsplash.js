var error = require("./../error").error
var path = require("path")
 https = require('https')
fs = require('fs');


var Unsplash = function(keys) {
    this.client_id = keys.client_id;
    this.apiUrl = "https://api.unsplash.com/search/photos?";
};


Unsplash.prototype.get = function(method, opts, result) {
    var api_url = this.apiUrl 
            + "&client_id=" + this.client_id	
	    + "&per_page=30"
            + "&page=1";
    for (var item in opts) {
        api_url += "&" + item + "=" + opts[item];
    }
    //api_url += "&tag_mode=all";
	
    https.get(api_url, function(res) {
        var data = "";
	
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            try {
                var jsonObj = JSON.parse(data);
            } catch (e) {
                return result(new error("Error parsing JSON object", "json_error", 500),null);
            }
            if(jsonObj["errors"]!=undefined){
                return result(new error("Got errors in response " + JSON.stringify(jsonObj), "error", 500), jsonObj);
	    }
            result(null, jsonObj);
        });
    }).on('error', function() {
	return result(new error("Cannot process request! Server not available", "server_unavailable",500), null);
	});
};


// export the module
module.exports.Unsplash = Unsplash;
