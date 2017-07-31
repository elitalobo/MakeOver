var error = function(message ,type, response_code) {

        this.message = message;
        this.type  = type;
        this.response_code = response_code;
}
module.exports.error = error



