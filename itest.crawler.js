
require("./logging");
var crawler = require("./gc-crawler");

exports.throwsIfNotSetup = function(test){

	crawler.listApi = "https://www.kimonolabs.com/api/eejpurec?apikey=tEM4EpAjchmcE3CRov4Gxai1rwoZ2o7v";

	crawler.getListObject = function(responseObject){
	    return responseObject.results.collection1;
	};

	crawler.parseItem = function(url, responseItem){ 

	    return responseItem.results.collection1;
	};

	crawler.getItemUrl = function(item){
	    return item.itemLink.href;
	};

	crawler.getCrawlUrl = function(item){
	    var regex = /\/lediga-objekt\/([^$]+)/gi;
	    var itemName = regex.exec(item.itemLink.href)[1];
	    return "https://www.kimonolabs.com/api/4l7fag34?apikey=tEM4EpAjchmcE3CRov4Gxai1rwoZ2o7v&kimpath2=" + itemName;
	};

	test.expect(1);

	crawler.run(function(items){

		console.log(items);
		test.ok(1);
		test.done();

	});

};