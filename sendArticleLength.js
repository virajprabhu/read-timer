
<<<<<<< HEAD
var location = document.location;
var uri = {
	spec: location.href,
	host: location.host,
	prePath: location.protocol + "//" + location.host,
	scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
	pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
};
var article = new Readability(uri, document).parse();

//var article = document.getElementsByTagName("body")[0].innerHTML;
var words = article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
=======
var domContent = document.getElementsByTagName("body")[0].outerHTML;
var words = domContent.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
>>>>>>> 0db128d9e29709dd0809b1e12da88160af6671aa
var count = words.length;
// alert(count);

chrome.extension.sendRequest(count);