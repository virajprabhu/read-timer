
var location = document.location;
var uri = {
	spec: location.href,
	host: location.host,
	prePath: location.protocol + "//" + location.host,
	scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
	pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
};
var article = new Readability(uri, document).parse();

var words = article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
var count = words.length;
// alert(count);

chrome.extension.sendRequest(count);