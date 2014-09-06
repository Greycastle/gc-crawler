
require("./logging");
var nock = require("nock");
var crawler = require("./crawler");

exports.throwsIfNotSetup = function(test){

	test.expect(5);

	var setupCrawler = function(){
		crawler.listApi = "test";
		crawler.getListObject = function(i){};
		crawler.parseItem = function(i){};
		crawler.getItemUrl = function(i){};
		crawler.getCrawlUrl = function(i){};
	};

	test.throws(function(){
		setupCrawler();
		crawler.listApi = null;
		crawler.run();
	});

	test.throws(function(){
		setupCrawler();
		crawler.getListObject = null;
		crawler.run();
	});

	test.throws(function(){
		setupCrawler();
		crawler.parseItem = null;
		crawler.run();
	});

	test.throws(function(){
		setupCrawler();
		crawler.getItemUrl = null;
		crawler.run();
	});

	test.throws(function(){
		setupCrawler();
		crawler.getCrawlUrl = null;
		crawler.run();
	});

	test.done();
};

exports.waitsForItemsBeforeReturning = function(test){

	crawler.getListObject = function(obj) { return obj; };
	crawler.getItemUrl = function(obj) { return "url"; };
	crawler.getCrawlUrl = function(obj) { return "http://test.com/" + obj.val; };
	
	crawler.parseItem = function(obj) { 
		if(obj.val == "no")
			throw new Error("this one fails");

		return obj;
	};

	var list = [{ val: "no" }, { val: "yes"}, { val: "maybe" }];

	nock("http://test.com").get("/yes").reply(200, { val: "yes" });
	nock("http://test.com").get("/no").reply(200, { val: "no" });
	nock("http://test.com").get("/maybe").reply(400, { val: "maybe" });

	test.expect(2);
	
	crawler.runList(list, function(items){
		test.equal(1, items.length);
		test.equal("yes", items[0].val);
		test.done();
	});
};