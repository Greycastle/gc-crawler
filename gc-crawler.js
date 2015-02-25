var request = require("request");  
var async = require("async");
var log = require("npmlog");

var crawler = {};

var isUndefined = function(obj){
    return obj == undefined || obj == null;
};

var validateInputs = function(listUrl, parsers, callback){

    if(isUndefined(listUrl) || typeof(listUrl) != 'string')
        throw "Invalid parameter: listUrl {" + typeof(listUrl) + "} must be a String";

    if(isUndefined(parsers) 
        || typeof(parsers) != 'object'
        || isUndefined(parsers.parseList)
        || isUndefined(parsers.parseListItem))
        throw "Invalid parameter: parsers { " + typeof(parsers) + " } must be object with signature { parseList: function(str), parseListItem: function(str) }";

    if(isUndefined(callback) || typeof(callback) != 'function')
        throw "Invalid parameter: callback {" + typeof(callback) + "} must be function(err, data)";

};

/**
 * Begins crawling a list url then sends the result to a first callback for 
 * parsing. That callback should return a list of new urls which will be parsed
 * in turn by second callback.
 *
 * @param {String} listUrl should be the url of the page containing a list of items to crawl
 * @param {Object} parsers should be an object with two functions, parseList(string) and parseListItem(string)
 * @param {Function} callback will be called upon completion, function(err, data)
 *
 * Example:
 * crawler.crawl('http://listsite', {
 *  parseList: function(listBody){
 *      return parseList(listBody); // Returns array of urls
 *  },
 *  parseListItem: function(listItemBody){
 *      return parseListItem(listItemBody); // Returns an item
 *  }, function(err, data){
 *       if(err)
 *           handleError();
 *       else
 *           next();
 *  });
 */
crawler.crawl = function(listUrl, parsers, callback){

    var logTag = 'crawler.crawl';

    validateInputs(listUrl, parsers, callback);

    log.verbose(logTag, "Requesting %s", listUrl);
    request(listUrl, function (error, response, body) {
        if(error || isUndefined(body)) {
            log.error(logTag, 'Failed to get %s: %j', listUrl, error);
            callback(err, null);
            return;
        }

        try {
            var urls = parsers.parseList(body);
            log.verbose(logTag, 'Parsed %s, $d results', listUrl, urls.length);

            async.map(urls, function(url, whenParsed){

                log.verbose(logTag, 'Requesting sub item: %s', url);
                request(url, function(error, response, body){
                    if(error || isUndefined(body)){
                        log.error(logTag, 'Failed to get %s: %j', url, error);
                        whenParsed(error, null);
                        return;
                    }

                    try {
                        whenParsed(null, parsers.parseListItem(body));
                        log.verbose(logTag, 'Parsed %s', url);
                    }catch(err) {
                        log.error(logTag, 'Failed to parse %s: %j', url, err);
                        whenParsed(err, null);
                    }
                });

            }, callback);
        }
        catch(exc) {
            log.error(logTag, 'Failed to parse %s: %j', listUrl, exc);
            callback(exc);
        }

    });

};

module.exports = crawler;