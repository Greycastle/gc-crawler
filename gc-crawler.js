
var request = require("request");  

var logReq = function(method, url, text){
    method("#" + hashCode(url) + ": " + text);
};

var logReqInfo = function(url, text){
    logReq(console.info, url, text);
};

var logReqErr = function(url, text){
    logReq(console.high, url, text);
};

var isRequestError = function(url, error, response, errorCallback){
    
    if(error == null && response != null && response.statusCode == 200)
        return false; 

    logReqErr(url, "Erronous response from service <" + response.statusCode + ">: " + error);

    if(errorCallback != null)
        errorCallback();

    return true;
};

var formatErrorAndJson = function(e, jsonStr){

    if(typeof jsonStr === "object")
        jsonStr = JSON.stringify(jsonStr, null, "  ");

    return e.message + "\r\n" + e.stack + "\r\n\r\nJson: " + jsonStr;
};

var hashCode = function(str) {
    return str.split("").reduce(function(a,b)
            {
                a=((a<<5)-a)+b.charCodeAt(0);
                return a;
            }, 0);
};

function Crawler() {

    this.getListObject = null;
    this.parseItem = null;
    this.getItemUrl = null;
    this.getCrawlUrl = null;
    this.listApi = null;
}; 

Crawler.prototype.validateCallbacks = function(){
    if(this.getListObject == null) throw new Error("getListObject needs to be defined");
    if(this.parseItem == null)     throw new Error("parseItem needs to be defined");
    if(this.getItemUrl == null)    throw new Error("getItemUrl needs to be defined");
    if(this.getCrawlUrl == null)   throw new Error("getCrawlUrl needs to be defined");
};

Crawler.prototype.run = function(callback){

    var crawler = this;
    if(this.listApi == null)        
        throw new Error("listApi needs to be defined");

    this.validateCallbacks();

    this.withRequest(this.listApi, (function(listObject){
        this.runList(listObject, callback);
    }).bind(this));
},

Crawler.prototype.withRequest = function(url, callback){
    this.withRequest(url, callback, {});
};

Crawler.prototype.withRequest = function(url, callback, args){

    logReqInfo(url, "Retrieving data from " + url);
    request(url, function (error, response, body) {
    
        args = args != null ? args : {};
        if(isRequestError(url, error, response, args.error))
                return;

        var responseObject;
        try{
            responseObject = JSON.parse(body);
        }catch(e){
            logReqErr(url, "Failed to parse service object: " + formatErrorAndJson(e, body));
        }

        logReqInfo(url, "Successfully retrieved json object from service");
        
        try{
            callback(responseObject);
        }catch(e){
            logReqErr(url, "Failed to process request: " + formatErrorAndJson(e, body));
        }
    });
};

Crawler.prototype.runItem = function(item, callback){

    try{
        
        var itemUrl = this.getItemUrl(item);
        var itemCrawlUrl = this.getCrawlUrl(item);

        this.withRequest(itemCrawlUrl, (function(crawledItem){

            try{
                callback(this.parseItem(itemUrl, crawledItem));
            }
            catch(e){
                console.high("Failed to crawl item: " + formatErrorAndJson(e, crawledItem));
            }

            callback();

            }).bind(this), {
                error: function(){ callback(); }
            });

    }catch(e){
        console.high("Failed to crawl item: " + formatErrorAndJson(e, item));
        callback();
    }
};

Crawler.prototype.runList = function(listObject, callback){
        
        listObject = this.getListObject(listObject);

        var itemsToProcess = listObject.length;
        var items = [];

        var itemProcessed = function(item){
            itemsToProcess -= 1;
            if(item != null) items.push(item);
            if(itemsToProcess == 0)
                callback(items);
        };

        listObject.forEach(function(item) { this.runItem(item, itemProcessed); }, this);
};

module.exports = {

    create : function(){
        return new Crawler();
    }

};