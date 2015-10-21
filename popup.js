/**
 * Popup script for Read Timer.
 * Implements functionality for total/remaining read time, learning user's read speed etc.
 */

// Debug flag
var debug = false;

// The word count on the current page.
var count = -1;

// Current read speed in WPM, default is average adult read speed.
var currentSpeed = 200;

if(!chrome) {
	alert('Please update Google Chrome to the latest version to run this extension.');
}

/**
 * Computes the estimate total read time of the article on the page.
 */
function totalTime(wordcount) {
	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		currentSpeed = backgroundPage.currentSpeed;
		readSpeedWPM = currentSpeed;
		wordcount = parseInt(wordcount);
		if(!isNaN(readSpeedWPM) && !isNaN(wordcount)){
			var readTime = wordcount / readSpeedWPM;
			document.getElementById('status').innerHTML = Math.ceil(readTime) + " min read";
		} else{
			document.getElementById('status').innerHTML = "Error: Content not found.";
		}
	});
}

/**
 * Listens for estimated remaining read time sent from content script.
 */
chrome.extension.onMessage.addListener(function(request) {
	if(request.scrollPercentage != undefined) {
		var timeLeft = Math.ceil((1-request.scrollPercentage) * count / currentSpeed) ;
		document.getElementById('remaining').innerHTML= "(" + timeLeft + " left)";
	}
});

/**
 * Main method that executes scripts for computing total and remaining read times.
 *
 */
window.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get("readTimeDefaultSpeed", function(result) {
    if(result && result.readTimeDefaultSpeed) {
      currentSpeed = result.readTimeDefaultSpeed;
      if(debug) {
        alert(currentSpeed + ' read from options.');
      }
    }
  });

	chrome.tabs.query({active: true, currentWindow:true}, function(activeTabs){
		targetTabID = activeTabs[0].id;

		chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
			chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: false}, function(result) {
				count = result;
				totalTime(count);
				chrome.runtime.getBackgroundPage(function(bg) {
					bg.count = count;
					bg.targetTabID = targetTabID;
					bg.debug = debug;
					bg.currentSpeed = currentSpeed;
				});
				chrome.tabs.executeScript({file: 'sendRemainingTime.js', allFrames: false}, function(){
					chrome.tabs.sendMessage(targetTabID, {wordcount:count});
				});
			});
		});
	});
});
