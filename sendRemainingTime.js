/*
 * Computes the time remaining based on the scroll position.
 */
var debug = true;
function showTimeLeft(){
	var scrollPos = window.pageYOffset | document.body.scrollTop
	var body = document.body, html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	chrome.runtime.sendMessage({scrollPercentage:(scrollPos/height)});
}

/*
 * Tracks the scroll event
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.message == "sendRemainingTime") {
		window.onscroll = function() {
			showTimeLeft();		
		}
	}
});
