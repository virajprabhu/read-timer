var location = document.location;

var uri = {
	spec: document.location.href,
	host: document.location.host,
	prePath: document.location.protocol + "//" + document.location.host,
	scheme: document.location.protocol.substr(0, document.location.protocol.indexOf(":")),
	pathBase: document.location.protocol + "//" + document.location.host + document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)
};

var article = new Readability(uri, document).parse();
var words = article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
var count = words.length;
count