/*
 * Computes the time remaining based on the scroll position.
 */
var debug = true;
var wc = -1;
function showTimeLeft(count){
	var scrollPos = window.pageYOffset | document.body.scrollTop
	var body = document.body, html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	chrome.extension.sendRequest({scrollPercentage:(scrollPos/height)});
}

/*
 * Tracks the scroll event
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.wordcount) {
		wc = request.wordcount;
		showTimeLeft(wc);
		window.onscroll = function() {
			if(wc != -1)
				showTimeLeft(wc);
			else if(debug) {
				alert('Count not received.');
			}
		}
	}	
});