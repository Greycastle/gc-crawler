gc-crawler
==========

A simple crawl helper that will help connect an api with page links with the crawler of the actual pages, like for using with Kimono API

## The idea

So the idea behind gc-crawler is that you've got one service, perhaps but not neccesarily, created using something like [Kimono API](http://kimonolabs.com). Problem is, Kimono's service allows you to crawl one page for urls and then use that list to crawl each page But it doesn't give you a way to retrieve the page url in the output api having all the pages.

This is definately problematic if you would need to reference that crawled url somehow so I build this small library as a way to bridge between one API responding with a json object with urls to crawling each url encapsulating fetching, caching and error handling along the way.

