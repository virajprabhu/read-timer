/*
 * Content Script for Read Timer
 * Makes calls to the Readability.js API and extracts the word count of the article.
 */
 function runReadability(){
	var loc = document.location;
	var uri = {
		spec: loc.href,
		host: loc.host,
		prePath: loc.protocol + "//" + loc.host,
		scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
		pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
	};
	var docClone = document.cloneNode(true);
	var article = new Readability(uri, docClone).parse();
	// Replace all separators with a custom separator
	return article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
}
var words = runReadability();
var wordCount = words.length;
var imageCount = document.getElementsByTagName("img").length;
chrome.runtime.sendMessage({wordCount: wordCount, imageCount:imageCount});