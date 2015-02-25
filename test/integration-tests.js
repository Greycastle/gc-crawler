
var log = require("npmlog");
var crawler = require("../gc-crawler");

log.enableColor();
log.level = 'verbose';

exports.parseNPM = function(test){

	try 
	{
		crawler.crawl('https://www.npmjs.com/', {
			parseList: function(body){
				return ['https://www.npmjs.com/'];
			},
			parseListItem: function(body){
				return "ok";
			}
		}, function(err, data){

			test.equal(data.length, 1);
			test.equal(data[0], "ok");
			test.done();

		});
	}
	catch(exc){
		log.error(exc);
		test.done();
	}	
};