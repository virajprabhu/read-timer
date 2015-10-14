/*
 * Popup script for Read Timer.
 * Implements functionality for total/remaining read time, learning user's read speed etc.
 */

// The word count on the current page.
var count = -1;

// The start time from when the browser action is clicked.
var startTime = new Date();

// Initialize time spent on page
var timeSpent = 0;

/** 
 * Computes the estimate total read time of the article on the page.
 */
function totalTime(wc){
	var count = wc;
	var wordLength = wc;	
	var averageReadSpeedWPM = 200;
	var readTime = wordLength / averageReadSpeedWPM;
	document.getElementById('status').innerHTML= Math.ceil(readTime) + "m read";	
}

/**
 * Reads a cookie and computes averaged read speed.
 * TODO: chrome.cookies not recognized
 */
function getSpeedCookie(){
	/*chrome.cookies.get({url:document.location,name:"read_timer_timetaken"},function(cookie){
		if(cookie!=null)
			alert("Got Cookie "+cookie.name+" "+cookie.value);
	});	*/
}

/**
 * Computes total time spent on the page, with the current tab active.
 */
function stopTimer(){
	var endTime = new Date();
	timeSpent += endTime - startTime;
	chrome.cookies.set({url:document.location,name:"read_timer_timetaken",value:timeSpent,expirationDate:2147483647});
}

/**
 * Listener for the active tab being closed.
 */
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	stopTimer();
});

/**
 * Listener for user navigating away from active tab.
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab) {
	if(changeInfo.url){
		stopTimer();
	}
});

/**
 * Listens for estimated remaining read time sent from content script. 
 */
chrome.extension.onRequest.addListener(function(request) {
	if(request.remainingTime != undefined) {
		document.getElementById('remaining').innerHTML=request.remainingTime + " left";
	}
});

/**
 * Main method that executes scripts for computing total and remaining read times.
 * TODO: Regain control of current window after reload and thus compute remaining time.
 */
window.onload = function() {
	chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
		chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: true}, function(result) {
			count = result;
			totalTime(count);					
			// chrome.tabs.executeScript({file: 'sendRemainingTime.js', allFrames: true});		
		});
	});
}