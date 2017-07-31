var path = require("path")
 https = require('https')
fs = require('fs');
var request = require("request")

var Shutterstock = function(keys) {
    this.apiKey = keys;
    this.apiUrl = "https://api.shutterstock.com";
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


Shutterstock.prototype.get = function(opts, result) {
    var api_path = "/v2/images/search?";
    api_path += "query=" + getKeys(opts["query"]);
    for (var item in opts) {
	if(item=="query") {
		continue;
	}
	else {
		api_path += "&" + item + "="; 
		api_path += opts[item];
	}
    }
    api_path += "&view=full";
    api_path += "&per_page=20&page=1";
    
    //api_url += "&tag_mode=all";
    this.apiKey["opaque"] = "opaque";
    this.logintype = "1";
    
    console.log(api_path);	
    var options = {
	url: this.apiUrl + api_path,
	auth: this.apiKey,
         headers: { 
      		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
      		'Content-Type' : 'application/x-www-form-urlencoded' 
   	}
	/* headers: {
      		'Authorization': 'Basic ' + new Buffer(this.apiKey).toString('base64')
   	 }*/   
    }
    console.log(options);
     request
                .get(options)
                .on('error', function(err) {
                        console.log(err);
                        return result(new Error("Cannot process request! Server not available"), null);
                })
                .on('response', function(res) {
                        var data = "";

                        res.on('data', function(chunk) {
                                data += chunk;
                        });
                        res.on('end', function() {
                                try {
                                         var jsonObj = JSON.parse(data);
                                } catch (e) {
                                        console.log(e);
                                        return result(new Error("Error parsing JSON"));
                                }

                                if(jsonObj.total_count <= 0) {
                                        console.log("error total image count equal to 0");
              				return result(new Error("Zero objects returned"), null);
				}
                                if(res.statusCode/100 != 2) {
                                        console.log("bad request");
                                        return result(new Error("Bad request "), null);
                                }
                                console.log("Successfully got images form shutterstock \n");
                                result(null, jsonObj);
                        });
                });
	
   
}


// export the module
module.exports.Shutterstock = Shutterstock
