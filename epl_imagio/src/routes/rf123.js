var error = require("./../error").error
var path = require("path")
 http = require('http')
fs = require('fs');
var xmlToJson = require('xml-js')

var Rf123 = function(account_details) {
    this.api_key = account_details.api_key;
    this.apiUrl = "http://api.123rf.com/rest/?method=123rf.images.search&apikey=" + this.api_key;
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


Rf123.prototype.get = function(opts, result) {
    var api_url = this.apiUrl
	    + "&perpage=30"
            + "&page=1";
    for (var item in opts) {
        api_url += "&" + item + "=" + opts[item];
    }
	
    http.get(api_url, function(res) {
        var data = "";
	
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            try {
                var jsonObj = JSON.parse(xmlToJson.xml2json(data, { compact: true, spaces:4 }));
            } catch (e) {
                return result(new error("Error parsing JSON object", "json_error", 500),null);
            }
            if(jsonObj.rsp ==undefined || jsonObj.rsp._attributes==undefined  ||  jsonObj.rsp._attributes.stat == undefined || jsonObj.rsp._attributes.stat!='ok'){
                return result(new error("Json stat is not 'ok' ", "json_error", 500), jsonObj);
	    }
            result(null, jsonObj.rsp.images);
        });
    }).on('error', function() {
	return result(new error("Cannot process request! Server not available", "server_unavailable",500), null);
	});
};


// export the module
module.exports.Rf123 = Rf123;
