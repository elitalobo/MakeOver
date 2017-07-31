var winston = require('winston')
var date = require("date-and-time")


var fs = require('fs');
var dir = 'logs';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var logger = new (winston.Logger)({
    transports: [
      //new (winston.transports.Console)({'timestamp':true}),
      new (winston.transports.File)({ filename: 'logs/'+date.format(new Date(), 'YYYY_MM_DD_HH:mm:ss')+ '_imagio.log', timestamp: true })
    ]
  });

module.exports = logger
