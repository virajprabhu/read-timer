/**
 * Popup script for Read Timer.
 * Implements functionality for total/remaining read time, learning user's read speed etc.
 */

// The word count on the current page.
var count = -1;

if(!chrome) {
	alert('Please update Google Chrome to the latest version to run this extension.');
}

if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

/** 
 * Computes the estimate total read time of the article on the page.
 */
function totalTime(wc) {
	computeSpeed(function(readSpeedWPM) {
		alert('readSpeed is ' + readSpeedWPM)
		var readTime = wc / readSpeedWPM;
		document.getElementById('status').innerHTML = Math.ceil(readTime) + "m read";	
	});
}

/** 
 * Document
 */
function computeSpeed(callback) {
	var averageReadSpeedWPM = 200;
	getSpeedCookie(function(cookie) {
		var readSpeed = -1;
		if(cookie != null)
			readSpeed = parseCookie(cookie);
		else
			readSpeed = averageReadSpeedWPM;
		callback(readSpeed);
	});
}

/**
 * Reads a cookie and computes averaged read speed.
 * 
 */
function getSpeedCookie(callback) {
	chrome.cookies.get({url:"http://localhost", name:"readTimerWPM"}, function(cookie){
		if(cookie!=null && callback!=null){
			callback(cookie);
		}
		else {
			alert("No such cookie found");
			callback(null);
		}		
	});	
}

/** 
 * Document
 */
function parseCookie(cookie) {
	var speedArr = cookie.value.split(",");
	var sum = 0;
	var len = speedArr.length;
	for(var i=0; i<len; i++){
		sum += speedArr[i];
	}
	return sum/len;
}

/**
 * Listens for estimated remaining read time sent from content script. 
 */
chrome.extension.onRequest.addListener(function(request) {
	if(request.remainingTime != undefined) {
		document.getElementById('remaining').innerHTML=request.remainingTime + " left";
	}
});

/**
 * Listens for the value of word count sent by content script.
 * TODO: How is this different from the onRequest listener used above?
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.count) {
		count = request.count;
		totalTime(count);
	}
});

/**
 * Main method that executes scripts for computing total and remaining read times.
 * TODO: Regain control of current window after reload and thus compute remaining time.
 */
window.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({active: true, currentWindow:true}, function(activeTabs){
		targetTabID = activeTabs[0].id;
		chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
			chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: true}, function(result) {
				chrome.runtime.getBackgroundPage(function(bg) {
					bg.count = count;
					bg.targetTabID = targetTabID;
				});				
				// chrome.tabs.executeScript({file: 'sendRemainingTime.js', allFrames: true});		
			});
		});
	});
});