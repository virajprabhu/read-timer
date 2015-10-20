/*
 * Content Script for Read Timer
 * Makes calls to the Readability.js API and extracts the word count of the article.
 */
 function runReadability(){
	var location1 = document.location;
    // window.location.reload();
	var uri = {
		spec: location1.href,
		host: location1.host,
		prePath: location1.protocol + "//" + location1.host,
		scheme: location1.protocol.substr(0, location1.protocol.indexOf(":")),
		pathBase: location1.protocol + "//" + location1.host + location1.pathname.substr(0, location1.pathname.lastIndexOf("/") + 1)
	};
	var docClone = document.cloneNode(true);
	var article = new Readability(uri, docClone).parse();
	// Replace all separators with a custom separator
	return article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
}
var words = runReadability();
var count = words.length;
count