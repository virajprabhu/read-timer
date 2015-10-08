
var domContent = document.getElementsByTagName("body")[0].outerHTML;
var words = domContent.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
var count = words.length;
console.log(count);


chrome.extension.sendRequest({type:"count",wordLength:count});

showTimeLeft()

function showTimeLeft(){
	var scrollPos = window.pageYOffset | document.body.scrollTop
	var body = document.body, html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	// console.log("Remaining Time: " + Math.ceil((1-scrollPos/height)*count/200 ))
	chrome.extension.sendRequest({type:"scroll",remainingTime:Math.ceil((1-scrollPos/height)*count/200)});
}

window.onscroll = function(){
	showTimeLeft()	
};
