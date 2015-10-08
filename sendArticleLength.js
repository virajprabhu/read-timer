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
// var count = 600;
// alert(count);

// chrome.extension.sendRequest({type:"count",wordLength:count});

function showTimeLeft(){
	var scrollPos = window.pageYOffset | document.body.scrollTop
	var body = document.body, html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	console.log("Remaining Time: " + Math.ceil((1-scrollPos/height)*count/200 ))

	chrome.extension.sendRequest({remainingTime:Math.ceil((1-scrollPos/height)*count/200), wordLength:count});
}

window.onscroll = function(){
	showTimeLeft()	
};
showTimeLeft()

