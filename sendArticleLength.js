/*
 * Content Script for Read Timer
 * Makes calls to the Readability.js API and extracts the word count of the article.
 */
 function runReadability(){
	var location = document.location;
    // window.location.reload();
	var uri = {
		spec: location.href,
		host: location.host,
		prePath: location.protocol + "//" + location.host,
		scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
		pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
	};
	var article = new Readability(uri, document).parse();
	// Replace all separators with a custom separator
	return article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
}

var words = runReadability();
var count = words.length;
count