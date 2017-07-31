var cheerio = require("cheerio")
var site = null;
var fs = require("fs")
var Image = require('./image').Image
var async = require("async")
var mappings = { 'Beauty and Fashion': "beauty+fashion", 'IT-services and Telecom': "IT-services+telecom", 'Science and Education':"science+education" ,'Travel and Transport': "travel+transport", 'Health' : "health", 'Electronics': "electronics",'Food and Nutrition': "food+nutrition", 'Finance': "finance", 'Entertainment': "entertainment", 'Sports': "sports", 'Art': "arts"};
function safe_division(a,b) {
	if(b==0) {
		console.log(site);
		console.log("dividing by zero");
		return 0.0;
	 }
	  return a/b;
}

var minify = require("html-minifier").minify;
var escape = require("escape-html")

var tldextract = require("tld-extract");
var textract = require("textract")
function analyze_src(filename, domain, details){
	var nSrc =0.0
	var srcLength =0.0
	var internalSrc =0.0
	var externalSrc =0.0
	var internalSubDir =0.0
	var $ = cheerio.load(fs.readFileSync(filename));
	console.log(filename);
	var srcElements = $('img');
	var photos = [];
	var count = 1;
	console.log("analysing source");
	//console.log(srcElements);
	$('img').each(function() {
		console.log("test");
		var src = $(this).attr('src');
		console.log(src);
		var height = $(this).attr('height');
		var width = $(this).attr('width');
		if(height==undefined) {
			height=null;
		}
		if(width==undefined) {
			width=null;
		}
		console.log("*************************************\n");
		if (src!=undefined && src.startsWith("http")) {
			console.log(src);		
			$(this).attr('id', "replacable_" + count.toString()).html()
			
			var id = $(this).attr('id');
			console.log(id);
			
			details.photos.push(new Image("replacable_" + count.toString(),src, height, width));
			count=count+1;
		}
		console.log("****************************************\n");
		
	});
	var strhtml = $.html();
	console.log(JSON.stringify(strhtml));
	details["source_code"]= strhtml;
	//strhtml.replace(/"/g, "\/\"");
	//strhtml.replace(/'/g,"\/\/'");
	//strhtml = escape(strhtml);
	//strhtml = minify(strhtml, { removeTagWhitespace : true});	
	return details;
}


function countOccurences(str, value) {
  var regExp = new RegExp(value, "gi");
  return (str.match(regExp) || []).length;
}




var encoding = require('encoding')
var utf8 = require("utf8")



function is_valid_website(foldername, sitefolder) {
	var is_folder = false;
	var is_file = false;
 	 try {
    		is_folder = fs.statSync(foldername + '/' + sitefolder).isDirectory();
  	} catch (ex) {
		console.log(ex);
	}
	try {
                is_file = fs.statSync(foldername + '/' + sitefolder + '/HTML_' + sitefolder + '-root.htm').isFile();
        } catch (ex) {
		console.log(ex);	
	} 


	if (!is_folder || !is_file){
		return false
	}
	var htmlString = fs.readFileSync(foldername + '/' + sitefolder + '/HTML_' + sitefolder + '-root.htm');
	var harString = fs.readFileSync(foldername + '/' + sitefolder + '/HAR_' + sitefolder + '.har');
	//var regex = re.compile("\"status\": (\d)\d\d")
	var r = /\"status\": (\d)\d\d/.exec(harString)
	if(r==null) {
		console.log("{{{ Could not find status string in HAR file }}}");
		return false;
	}
	else{
		if (r[0] == '4' ||  r[0] == '5') {
			console.log('{{{ 4xxx or 5xx error on this request. Skipping. }}}');
			return false;
		}
	}
	if (htmlString.toString().indexOf('<html><head></head><body></body></html>')!=-1) {
		console.log('{{{ Only default tag sequence found }}}');
		return false;
	}
	if(htmlString == null)  {
		console.log('{{{ htmlstring is none }}}');
		return false;
	}
	
	if(htmlString.length < 250) { 
		console.log('{{{ htmlstring is too short }}}')
		return false;
	}
	return true;
}




var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};
var sizeOf = require('image-size')
function is_typo_domain(sitefolder) {
	return false;
}

   var fs = require('fs'),
    request = require('request');
/*
function downloadImage(params, old_callback) {
var photo = params["photo"];
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
download(photo.url,"data/" + photo.url.replace(/\//g,'_'),function() {
	var new_url = "data/" + photo.url.replace(/\//g,'_');
	var dimensions = sizeOf(new_url);
	photo.local_url = new_url;
	photo.width = dimensions.width;
	photo.height = dimensions.height;
	old_callback(null,photo);
});
}

*/
var Url = require('url')
var http = require('http')
var https = require('https')

function downloadImage(params, old_callback) {
	var photo = params["photo"];
	console.log(photo);
	var options = Url.parse(photo.url);
	var requester = http;
 	if(photo.url.startsWith('https')) {
		requester = https;
	}
		requester.get(options, function (response) {
  		var chunks = [];
	  	response.on('data', function (chunk) {
    		chunks.push(chunk);
  	}).on('end', function() {
    	var buffer = Buffer.concat(chunks);
	    var dimensions = sizeOf(buffer);
	    photo.width = dimensions.width;
        	photo.height = dimensions.height;
        	old_callback(null,photo);

  	});
	});
	
		

}


	
function downloadAndProcessImages(details, old_callback) {
	var photos = details["photos"];
	var final_photos = []
	var flag = true;
	 var async_queue = async.queue(function(task, callback) {
                var func = task["funct"];
                var params = task["parameters"];
                func(params, callback);
                return;
        },100);
         async_queue.drain  = function() {
                console.log("drain called in feature_extractor \n");
		details["photos"]=final_photos;
		details["photos"].push(details["suggested"]);
                old_callback({ success: true, details : details });
                return;
         }

                var cb = function(err, results) {
                                console.log("****************************************");
                                console.log(results);
                                console.log("*****************************************");
                                if(err) {
                                        console.log(err);
					if(flag) {
                                        	old_callback({ success: false, details: null});
						flag=false;
					}
                                        return ;
                                }

                                        final_photos.push(results);


                                return;
                }

                for(var cnt=0;cnt < photos.length; cnt++) {
                        var func = downloadImage;
                        async_queue.push( { funct : func , parameters : { photo: photos[cnt] }}, cb);
                        console.time("got_images")
                }
}


var htmlToText= require("html-to-text");

function clean_html(html){
    var html = html.toString().trim();
    var cleaned = html.replace(/<(script|style)[^]*?>[^]*?(<\/\1>)/g,"");
    //var cleaned = html.replace(/<(script|style).*?>.*?(</\1>)/,"");
    cleaned = cleaned.replace(/<[^]*?>/g, " ")
    cleaned = cleaned.replace(/&nbsp;/g, " ")
    cleaned = cleaned.replace(/\s\s+/g, ' ');
    return cleaned.trim()
}


const punycode = require('punycode')
var encoding = require('encoding')
var utf8 = require("utf8")

function analyze_text(filename, details, old_callback){
	textract.fromFileWithPath(filename, function( error, text ) {
	console.log(text);
	processText(text,details, old_callback);
})
	
}

function process_result(results) {
	var tags = []
	var probs = []
	var verticals = results["top_3"];
	var photo = new Image("recommended",null, 0, 0);

	photo.tags = []
	photo.business_verticals = [];
	for(var idx=0;idx<verticals.length;idx++) {		
		if(verticals[idx]["prob"]>=0.3) {
			probs.push(verticals[idx]["prob"]);
			photo.business_verticals.push({ tagName: mappings[verticals[idx]["bv"]], score: 1.0});
		}
	}
	var sum=0;
	var tagName="";
	var keywords = results["keywords"];
	for(var idx=0;idx<keywords.length;idx++) {
		sum=0;
		tagName = keywords[idx]["keyword"];
		for(var jdx=0;jdx<probs.length;jdx++) {
			sum = sum + probs[jdx]*keywords[idx]["scores"][jdx];
		}
		tags.push({tagName: tagName.trim(), score: sum });
	}
	tags.sort(function(a, b) {
    		return b["score"] - a["score"];
	});
	for(var idx=0;idx<3 && idx< tags.length;idx++) {
		if(tags[idx]["score"]>=0.3) {
			photo.tags.push(tags[idx]);
		}
	}
	return photo;
	
	
}

function processText(text, details, old_callback) {
	//console.log(old_callback);
	text  = text.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')
	//console.log(text);
	request.post("http://54.208.20.206/api/get_top_business_keywords" ,
                                  { json: { "text" : JSON.stringify(text)  }},
                                  function (error, response, body) {
					//console.log("body");
					 //console.log(body);	
					 //console.log(response);
					//console.log(error);
					var result = body;
					console.log(result);
					console.log(error);
                                        var results = JSON.parse(JSON.stringify(result));
					if(results["error"]!=null && results["error"]!=undefined && results["error"]!=0) {
						old_callback("could not get keywords from site", null);
						return;
					}
					var photo = process_result(results);
					console.log(photo);
					details["photos"]=[];
					details["suggested"]=photo;
                                                old_callback(null, details);

                                   });
}

function extract_website_links(foldername, sitefolder, old_callback){
	sitefolder = sitefolder.replace(/\//g,"_");
	site = sitefolder
	var details = {}
	var text = {};
	 var process_callback = function(err, details) {
                        if(err) {
                                old_callback(null);
                                return;
                        }
                for(var cnt =0 ; cnt < fileList.length; cnt ++ ) {
                        var _file = fileList[cnt];
                        if( _file.startsWith('HTML_') && _file.indexOf("root.htm")>=0){
                                //# Initalize the temporary variables

                                details = analyze_src(foldername + '/' + sitefolder + '/' + _file, sitefolder, details);
                                details["path"] = foldername + "/" + sitefolder.replace(/\//g,"_") +"/" + _file;
                                console.log(details["path"])
                                console.log(details["photos"])
                                console.log(old_callback);
                                downloadAndProcessImages(details, old_callback);
                                //return { success: true , details: details}
                        }
                }

                //console.log("###################################################");
                //# Ratio and average calculation (with division by zero check)
                return { success : true , details: details };
                }

	if(is_valid_website(foldername, sitefolder)) {
		var fileList = []
                walkSync(foldername + '/' + sitefolder, fileList);
		for(var cnt =0 ; cnt < fileList.length; cnt ++ ) {
                        var _file = fileList[cnt];
                        if( _file.startsWith('HTML_') && _file.indexOf("root.htm")>=0){

				analyze_text(foldername + "/" + sitefolder.replace(/\//g,"_") +"/" + _file, details,process_callback);
				break;
			}
		}
		

				
	}
	else{
		old_callback(null);
		console.log("Failed site - ",sitefolder.toString());
		return { success : false, features : null };
	}
	

	
}


module.exports.extract_website_links = extract_website_links
//extract_website_links("data","exerciseright.com.au_marathon-running_");

