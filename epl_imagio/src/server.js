var async = require('async')
var requestHandler = require("./routes/requestHandler")
var cache = require("./routes/cache").cache
cache.reset()
var Socket = require("./socket").Socket
var restResponse = require("./restResponse").restResponse
var fs = require("fs")
var spdy = require('spdy')
var path = require("path")
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express')
var uuid = require("uuid");
var cors = require("cors")
var app = require('express')();


var argv = require('minimist')(process.argv.slice(2));
var bodyParser = require( 'body-parser' );
var subpath = express();
//app.use(express.static('dist'));
//app.use(bodyParser());
app.use("/v1", subpath);

var swagger = require('swagger-node-express').createNew(subpath);
var logger = require("./routes/logger")

swagger.setApiInfo({
        title: "Imagio API",
        description: "Image search service",
        termsOfServiceUrl: "",
        contact: "elita.l@endurance.com",
        license: "",
        licenseUrl: ""
    });
app.use(favicon());
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(express.static('dist'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port1 =  8080;
server.listen(port1,  process.argv[2] || "127.0.0.1", function (err) {
    if (err)
        throw err;
    else
        console.log('Socket and Rest calls can be made on port : ' + port1)
});




process.on('uncaughtException', function (err) {
	logger.log('error', "Uncaught Exception", err);
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
        throw err;
});


var handle_api_requests = function(request, response, next) {
	if(request.method != "GET") {
		response.status(405);
	        response.send({ error : { message : "This api only allows GET request on the specified url!" , type: "Method Not Allowed!" }, status: "failed" }).end();
		return;
		
	}
	var responseObj = new restResponse(response);
	var uid = uuid.v4()
	logger.log('info', "Got new request. Id: " + uid, request.query);
	console.log("Got request " +  JSON.stringify(request.query));
	requestHandler.handle_requests(request.query,responseObj,uid);
}

var handle_status_check_request = function(request, response, next) {
	if(request.method != "GET") {
		response.status(405);
		response.send({ error: { message : "This api only allows GET request on the specified url!", type: "Method Not Allowed!"}, status: "failed" }).end();
		return;
	}
	response.status(200);
	response.send({ status: "success" });
}

app.all('/images/search', handle_api_requests)

app.all('/health', handle_status_check_request)

io.on('connection', function (socket) {
    logger.log('info',"Got a new connection", socket);
    console.log("got a new connection");
    socket.on('getImages', function (data) {
	    var uid = uuid.v4();
	    logger.log('info', "Got getImages request. Request Id: " + uid, data);
	    socket.emit('request_acknowledged', { uid: uid } );
	    if(data == null ||  typeof(data)!='object') {
		logger.log('error', "Request Id: "+ uid + "Bad Request! Expected JSON object as input. Got ", data);
		socket.emit('got_error', { uid: uid, type: "Bad Request!" , message : "Expected json object as input", error_code: 400 } );
		return;
	    }
	    var responseObj = new Socket(socket);
	    requestHandler.handle_requests(data,responseObj,uid); 
    });
    socket.on('error', function(err) {
		console.log(err);
		logger.log('error', "Socket Error: ", err);
		console.log("error - asking client to disconnect");
		socket.emit('disconnect_from_server', null);
		//socket.disconnect(true);
    });
    socket.on('disconnect_client', function(err) {
		logger.log('info', "Disconnecting client ");
		console.log("disconnecting client");
		socket.disconnect(true);
    });

});

swagger.configureSwaggerPaths('', 'api-docs', '');
var applicationUrl = "http://0.0.0.0:8080";
swagger.configure(applicationUrl, '1.0.0');
app.get('/', function (req, res) {
        res.sendFile(__dirname + '/dist/index.html');
    });
