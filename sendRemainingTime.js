// alert("in Send remaining time");
/*
 * Computes the time remaining based on the scroll position.
 */
var debug = true;
var wc = -1;
function showTimeLeft(count){
	var scrollPos = window.pageYOffset | document.body.scrollTop
	var body = document.body, html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	// alert("Count: " + count);
	// alert("Remaining Time: " + Math.ceil((1-scrollPos/height)*count/200));
	chrome.extension.sendRequest({remainingTime:Math.ceil((1-scrollPos/height)*count/200)});
}

/*
 * Tracks the scroll event
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.wordcount) {
		// alert("In send remaining time: " + request.wordcount);	
		wc = request.wordcount;
		showTimeLeft(wc);
		window.onscroll = function() {
			// console.log('scrolled!');
			if(wc != -1)
				showTimeLeft(wc);
			else if(debug) {
				alert('count not rcvd');
			}
		}
	}	
});