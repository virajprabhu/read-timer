// The start time from when the browser action is clicked.
var startTime = new Date();

// Debug flag
var debug = false;

// Initialize time spent on page
var timeSpent = 0;

// Current read speed for the user
var currentSpeed = 200;

// The word count on the current page.
var count = -1;

// Previous active tab ID
var prevTabID = -1;

// Target active tab ID
var targetTabID = -1;

/**
 * Check for Anomalies in the readSpeed based on previous data
 */
function isAnomaly(readSpeed) {
	if (debug) {
		return false;
	}
	return Math.abs(readSpeed-currentSpeed)/currentSpeed > 0.5;
}

if ( !Date.now ) {
    Date.now = function() { return new Date().getTime(); }
}

/**
 * Saves the read speed for the current page to chrome.storage
 *
 */
function saveReadSpeed() {
	if (debug) {
		alert('Saving read speed with count ' + count);
	}

	if (timeSpent != 0 && count != -1) {
		count = parseInt(count);
		timeSpent = parseInt(timeSpent);
		if (!isNaN(count) && !isNaN(timeSpent)) {
			readSpeed = Math.round(count * 1000 * 60 / timeSpent);
			chrome.storage.sync.get("readTimerWPM", function(result) {
				if (debug) {
					alert('Computed readspeed as ' + readSpeed);
				}
				if (!isAnomaly(readSpeed)) {
					if (!result || !result.readTimerWPM) {
						if (debug){
							alert("Setter: none found");
						}
						chrome.storage.sync.set({"readTimerWPM": [[Date.now(), readSpeed]]});
					} else {
						result.readTimerWPM.push([Date.now(), readSpeed]);
						if (debug){
							alert("Setter: setting " + JSON.stringify(result.readTimerWPM));
						}
						chrome.storage.sync.set({"readTimerWPM": result.readTimerWPM});
					}
				 }
		        else if (debug) {
		          alert('Anomaly. Speed discarded.');
		        }
			});
		} else {
			return;
		}
	} else if (debug) {
		alert('Error. Count not received.');
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
	if (tabId == targetTabID) {
		stopTimer();
		saveReadSpeed();
	}
});

/**
 * Listener for the active window being closed.
 */
chrome.windows.onRemoved.addListener(function(windowId) {
	stopTimer();
	saveReadSpeed();
});

/**
 * Listener for user navigating away to a different url.
 * TODO: Deal with cached pages.
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if ((tabId == targetTabID) && changeInfo.url) {
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
	if (activeTabID == targetTabID) {
		startTimer();
	} else if (prevTabID == targetTabID) {
		stopTimer();
	}
	prevTabID = activeTabID;
});

/**
 * Listener for changes to the readTimerWPM variable in chrome.storage. The currentSpeed is recomputed accordingly.
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		if (debug) {
			alert('Storage key ' + key+ " in namespace " +namespace + " changed. " + "Old value was " + storageChange.oldValue + " new value is " + storageChange.newValue);
		}

		if (key == "readTimerWPM") {
			var speedArr = storageChange.newValue;
			var newCurrentSpeed;
			if (!speedArr) {
				continue;						// No changes to currentSpeed.
			} else {
				var sum = 0;
				var len = speedArr.length;
				if (len==0) {
					continue;					// No changes to currentSpeed.
				}
				for (var i=0; i<len; i++) {
					var speed = parseFloat(speedArr[i][1]);
					if (!isNaN(speed)) {
						sum += speed;
					}
				}
				currentSpeed = Math.round(sum/len);			// Set averageSpeed
			}
		}
		chrome.storage.sync.set({"readTimeDefaultSpeed": currentSpeed}, function() {
			if (debug) {
     			alert('Options saved');
    		}
		});
  	}
});