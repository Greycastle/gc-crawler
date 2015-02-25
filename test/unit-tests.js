
var nock = require("nock");
var log = require("npmlog");
var crawler = require("../gc-crawler");

log.enableColor();
log.level = 'verbose';

exports.throwsIfNotSetup = {
	
	missingUrl: function(test){

		test.expect(1);
		test.throws(function(){
			crawler.crawl(null, { parseList: function(body){}}, function(err, data){});
		});
		test.done();
	},

	missingParseList: function(test){
		test.expect(1);
		test.throws(function(){
			crawler.crawl('http://localhost', { parseList: function(body){}	}, function(err, data){});
		});
		test.done();
	},

	missingParseListItem: function(test){
		test.expect(1);
		test.throws(function(){
			crawler.crawl('http://localhost', { parseListItem: function(body){}	}, function(err, data){});
		});
		test.done();
	},

	missingCallback: function(test){
		test.expect(1);
		test.throws(function(){
			crawler.crawl('http://localhost', { 
				parseListUrls: function(body){}	
				, parseListItem: function(body){}	
			}, null);
		});
		test.done();
	}
};

exports.getsListUrl = function(test){

	nock("http://localhost").get("/").reply(200, true);
	test.expect(1);
	
	try {

		crawler.crawl('http://localhost', {
			parseList: function(body){
				test.equal(body, 'true');
				return [];
			}
			, parseListItem: function(body) {}
		}, function(err, data){
			test.done();
		});

	} catch(exc) {
		log.error(exc);
		test.done();
	}
};