/**
 * Popup script for Read Timer.
 * Implements functionality for total/remaining read time, learning user's read speed etc.
 */

// The word count on the current page.
var count = -1;

// The start time from when the browser action is clicked.
var startTime = new Date();

// Initialize time spent on page
var timeSpent = 0;

// Previous active tab ID
var prevTabID = -1;

// Target active tab ID
var targetTabID = -1;

if(!chrome) {
	alert('Please update Google Chrome to the latest version to run this extension.');
}

if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
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
 * Computes the estimate total read time of the article on the page.
 */
function totalTime(wc){
	computeSpeed(function(readSpeedWPM) {
		// alert(readSpeedWPM);
		var count = wc;
		alert(count);
		var readTime = count / readSpeedWPM;
		document.getElementById('status').innerHTML = Math.ceil(readTime) + "m read";	
	});
}

/** 
 * Document
 */
function computeSpeed(callback){
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
function getSpeedCookie(callback){
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
 * 
 */
function saveReadSpeed() {
	alert('saving read speed');
	if(timeSpent != 0) {
		readSpeed = count/timeSpent;
		alert("setting cookie in "+"http://localhost");
		chrome.cookies.get({url:"http://localhost", name:"readTimerWPM"},function(cookie){
			if(cookie == null)
				chrome.cookies.set({url:"http://localhost", name:"readTimerWPM", value:""+readSpeed, expirationDate:2147483647});
			else
				chrome.cookies.set({url:"http://localhost", name:"readTimerWPM", value:""+cookie.value+","+readSpeed, expirationDate:2147483647});
		});
	}
}

/**
 * Restarts the timer.
 */
function startTimer() {
	startTime = new Date();
}
/**
 * Pauses the timer.
 */
function stopTimer() {
	var endTime = new Date();
	timeSpent += (endTime - startTime);	
}


/**
 * Listener for the active tab being closed.
 */
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if(tabId == targetTabID) {
		// alert('tab closed');
		stopTimer();
		saveReadSpeed();
	}
});

/**
 * Listener for the active window being closed.
 */
chrome.windows.onRemoved.addListener(function(windowId) {
	// alert('window closed');
	stopTimer();
	saveReadSpeed();
});

/**
 * Listener for user navigating away to a different url.
 * TODO: Deal with cached pages.
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if((tabId == targetTabID) && changeInfo.url) {
		// alert('url changed');
		stopTimer();
		saveReadSpeed();
	}
});

/**
 * Listener for user switching to a different tab.
 */
chrome.tabs.onActivated.addListener(function(activeInfo) {
	// Only dealing with tabs in the same window for now.
	var activeTabID = activeInfo.tabId;
	// alert('current active tab id: ' + activeTabID);
	if(activeTabID == targetTabID) {
		startTimer();
	}
	else if(prevTabID == targetTabID) {
		stopTimer();
	}
	prevTabID = activeTabID;
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
	chrome.tabs.query({active: true, currentWindow:true}, function(activeTabs){
		targetTabID = activeTabs[0].id;
		chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
			chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: true}, function(result) {
				count = result;
				totalTime(count);					
				// chrome.tabs.executeScript({file: 'sendRemainingTime.js', allFrames: true});		
			});
		});
	});
}