
var log = require("npmlog");
var cheerio = require('cheerio');
var crawler = require("../gc-crawler");

log.enableColor();
log.level = 'verbose';

exports.parseNPM = function(test){

	try 
	{
		crawler.crawl('https://www.npmjs.com/', {
			parseList: function(body){
				var $ = cheerio.load(body);
				var packages = $('a.package-logo').map(function(i, el){
					return "https://www.npmjs.com" + $(el).attr('href');
				}).get();
				return packages;
			},
			parseListItem: function(body){
				var $ = cheerio.load(body);
				return $('h1.package-name').text();
			}
		}, function(err, data){

			test.equal(data.length, 15);
			test.equal(data[0], "browserify");
			test.done();

		});
	}
	catch(exc){
		log.error(exc);
		test.done();
	}	
};