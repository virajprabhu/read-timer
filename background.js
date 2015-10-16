// The start time from when the browser action is clicked.
var startTime = new Date();
var debug = false;
// Initialize time spent on page
var timeSpent = 0;

// The word count on the current page.
var count = -1;

// Previous active tab ID
var prevTabID = -1;

// Target active tab ID
var targetTabID = -1;

if(!chrome.cookies) {
  // chrome.cookies = chrome.experimental.cookies;
}
/**
 * Check for Anomalies in the readSpeed based on previous data
 */
function isAnomaly(readSpeed){
	return true;
}

/**
 * Document
 * 
 */
function saveReadSpeed() {
	if(debug){
		alert('saving read speed with count ' + count);
	}
	if(timeSpent != 0 && count != -1) {
		readSpeed = Math.round(count*1000*60/timeSpent);
		if(isAnomaly(readSpeed)){
			// alert("setting cookie in http://localhost :: "+readSpeed);
			chrome.cookies.get({url:"http://localhost", name:"readTimerWPM"},function(cookie){
				if(cookie == null)
					chrome.cookies.set({url:"http://localhost", name:"readTimerWPM", value:""+readSpeed, expirationDate:2147483647});
				else
					chrome.cookies.set({url:"http://localhost", name:"readTimerWPM", value:""+cookie.value+","+readSpeed, expirationDate:2147483647});
			});
		}
	}
	else
		alert('Error. count not received.');
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
	// alert("timeSpent is "+timeSpent);
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

