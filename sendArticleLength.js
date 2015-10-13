var location = document.location;

var uri = {
	spec: document.location.href,
	host: document.location.host,
	prePath: document.location.protocol + "//" + document.location.host,
	scheme: document.location.protocol.substr(0, document.location.protocol.indexOf(":")),
	pathBase: document.location.protocol + "//" + document.location.host + document.location.pathname.substr(0, document.location.pathname.lastIndexOf("/") + 1)
};
// var body = document.getElementsByTagName("body")[0].innerHTML;
// console.log(body);
/*function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

var dupDoc = clone(document);*/
var article = new Readability(uri, document).parse();
var words = article.content.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
var count = words.length;
// alert('count' + count);
count

// document.getElementsByTagName("body")[0].innerHTML = body; // to rectify the wierd bug caused by Readability where the page elements get removed.

// var count = 600;
// alert(count);

// chrome.extension.sendRequest({type:"count",wordLength:count});
