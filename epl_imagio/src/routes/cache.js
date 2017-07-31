var LRU = require("lru-cache")
        ,options = { max: 10000000
		, length: function (n, key) { return JSON.stringify(n).length + key.length }
                , maxAge: 1000*60*60 }
        , cache = LRU(options)
        , otherCache = LRU(50)

module.exports.cache = cache
