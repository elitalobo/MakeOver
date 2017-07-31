var error = require("./../error").error
var path = require("path")
 https = require('https')
fs = require('fs');


var Flickr = function(keys) {
    this.apiKey = keys.api_key;
    this.apiUrl = "https://api.flickr.com/services/rest/?";
};


Flickr.prototype.get = function(method, opts, result) {
    var api_url = this.apiUrl
            + "&method=flickr." + method
            + "&api_key=" + this.apiKey
            + "&format=json"
            + "&nojsoncallback=1" 
	    + "&tag_mode=all"
	    + "&extras='url_sq,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o'"
	    + "&per_page=50"
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
            
            if(!jsonObj.stat || jsonObj.stat != 'ok')
                return result(new error("Json object status not 'ok'", "json_error", 500), jsonObj);
            
            result(null, jsonObj);
        });
    }).on('error', function() {
	return result(new error("Cannot process request! Server not available", "server_unavailable",500), null);
	});
};


// export the module
module.exports.Flickr = Flickr;
