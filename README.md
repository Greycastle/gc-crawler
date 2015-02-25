gc-crawler
==========

A very simple crawl helper to make it simpler to go from one page of listed 
items to parsing all child items.

## Usage

The library only helps to make it easier to parse sub items, the actual parsing 
is up to you, here cheerio is used to for parsing.

```javascript
var cheerio = require("cheerio");
var crawler = require("gc-crawler");

// Specify url to crawl
crawler.crawl('https://www.npmjs.com/', {
	// Callback to parse the list page html body into links
	parseList: function(body){
		var $ = cheerio.load(body);
		var packages = $('a.package-logo').map(function(i, el){
			return "https://www.npmjs.com" + $(el).attr('href');
		}).get();
		return packages;
	},
	// Callback to parse each item body into an object
	parseListItem: function(body){
		var $ = cheerio.load(body);
		return $('h1.package-name').text();
	}
}, function(err, data){

	// Will recieve an array with a string for each page containing the package title

});