/**
 * Popup script for Read Timer.
 * Implements functionality for total/remaining read time, learning user's read speed etc.
 */
var debug = false;
// The word count on the current page.
var count = -1;

var currentSpeed = 200;

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
		currentSpeed = readSpeedWPM;
		var readTime = wc / readSpeedWPM;
		document.getElementById('status').innerHTML = Math.ceil(readTime) + "m read";	
	});
}

/** 
 * Document
 */
function computeSpeed(callback) {
	getSpeedCookie(function(cookie) {
		var readSpeed = -1;
		if(cookie != null)
			readSpeed = parseCookie(cookie);
		else
			readSpeed = currentSpeed;
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
			if(debug){
				alert("No such cookie found");
			}
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
	// alert("Array Length: "+len);
	for(var i=0; i<len; i++){
		sum += parseFloat(speedArr[i]);
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
 * Main method that executes scripts for computing total and remaining read times.
 * TODO: Regain control of current window after reload and thus compute remaining time.
 */
window.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({active: true, currentWindow:true}, function(activeTabs){
		targetTabID = activeTabs[0].id;

		chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
			chrome.tabs.executeScript(null, { file: "jquery-2.1.4.min.js" }, function() {
				chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: true}, function(result) {
					count = result;
					totalTime(count);
					chrome.runtime.getBackgroundPage(function(bg) {
						bg.count = count;
						bg.targetTabID = targetTabID;
						bg.debug = debug;
						bg.currentSpeed = currentSpeed;
					});	
					chrome.tabs.executeScript({file: 'sendRemainingTime.js', allFrames: true}, function(){					
						chrome.tabs.sendMessage(targetTabID, {wordcount:count});
					});
				});
			});
		});
	});
});