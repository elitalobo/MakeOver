var error = require("./../error").error
var path = require("path")
 http = require('http')
fs = require('fs');


var BigStock = function(account_details) {
    this.account_id = account_details.account_id;
    this.apiUrl = "http://api.bigstockphoto.com/2/" + this.account_id + "/search/?";
};


function getKeywords(keys) {
        final_keys = "";
        for(var cnt=0;cnt<keys.length;cnt++) {
                if(keys[cnt]==',') {
                        final_keys += '-';
                }
                else
                        final_keys += keys[cnt];
        }
        return final_keys;
}

BigStock.prototype.get = function(opts, result) {
    var api_url = this.apiUrl
            + "&response_detail=all"
	    + "&limit=30"
            + "&page=1";
    for (var item in opts) {
	if(item=="q") {
		api_url += "&" + item + "=" + getKeywords(opts[item]);
	}
	else 
        	api_url += "&" + item + "=" + opts[item];
    }
	
    http.get(api_url, function(res) {
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
            
            if(!jsonObj.message || jsonObj.message != 'success' || !jsonObj.response_code || jsonObj.response_code!=200)
                return result(new error("Json did not return 200 response_code ", "json_error", 500), jsonObj);
            
            result(null, jsonObj);
        });
    }).on('error', function() {
	return result(new error("Cannot process request! Server not available", "server_unavailable",500), null);
	});
};


// export the module
module.exports.BigStock = BigStock;
