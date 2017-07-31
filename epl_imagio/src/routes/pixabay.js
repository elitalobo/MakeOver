var path = require("path")
 https = require('https')
fs = require('fs');


var Pixabay = function(keys) {
    this.apiKey = keys.api_key;
    this.apiUrl = "https://pixabay.com/api/?";
};


function getKeys(keys) {
	final_keys = "";
	for(var cnt=0;cnt<keys.length;cnt++) {
		if(keys[cnt]==',') {
			final_keys += '+';
		}
		else
			final_keys += keys[cnt];
	}
	return final_keys;
}


Pixabay.prototype.get = function(opts, result) {
    var api_url = this.apiUrl
            + "key=" + this.apiKey;
    for (var item in opts) {
        api_url += "&" + item + "=";
	if(item=="q") {
		api_url += getKeys(opts[item]);
	}
	else 
		api_url += opts[item];
    }
    api_url += "&per_page=20&page=1";
    //api_url += "&tag_mode=all";
    console.log(api_url);	
    https.get(api_url, function(res) {
        var data = "";
	
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            try {
                var jsonObj = JSON.parse(data);
            } catch (e) {
                return result(new Error("Error parsing JSON"));
            }
		
	    if(res.statusCode/100 != 2) {
		            return result(new Error("Bad Request"), null);
	    }
            if(jsonObj.totalHits <= 0) {
		console.log("Got zero images");
                return result(new Error("Json object status not 'ok'"), jsonObj);
            }
            result(null, jsonObj);
        });
    }).on('error', function() {
	console.log("Got error");
	return result(new Error("Cannot process request! Server not available"), null);
	});
};


// export the module
module.exports.Pixabay = Pixabay;
