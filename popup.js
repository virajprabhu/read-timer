/**
 * Popup script for Read Timer.
 * Implements functionality for total/remaining read time, learning user"s read speed etc.
 */

// Debug flag
var debug = false;

// The word count on the current page.
var count = -1;

// Current read speed in WPM, default is average adult read speed.
var currentSpeed = 200;

if (!chrome) {
	alert("Please update Google Chrome to the latest version to run this extension.");
}


/**
 * Computes the estimate total read time of the article on the page.
 */
function totalTime(wordcount, imageCount) {
	console.log("Image count is " + imageCount);
	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		currentSpeed = backgroundPage.currentSpeed;
		readSpeedWPM = currentSpeed;
		wordcount = parseInt(wordcount);
		if (!isNaN(readSpeedWPM) && !isNaN(wordcount)) {
			var readTime = (wordcount / readSpeedWPM) + (imageCount * 12 / 60);
			document.getElementById("status").innerHTML = Math.ceil(readTime) + " min read";
		} else {
			document.getElementById("status").innerHTML = "Error: Content not found.";
		}
	});
}

/**
 * Listens for estimated remaining read time sent from content script.
 */
chrome.extension.onMessage.addListener(function(request) {
	if (request.scrollPercentage != undefined) {
		var timeLeft = Math.ceil((1-request.scrollPercentage) * count / currentSpeed) ;
		document.getElementById("remaining").innerHTML = "(" + timeLeft + " left)";
	}
});

/**
 * Listens for word and image count sent from content script, and executes sendRemainingTime.js 
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.imageCount != undefined && request.wordCount != undefined) {
		count = request.wordCount;
		imageCount = request.imageCount;

		chrome.runtime.getBackgroundPage(function(bg) {
			bg.count = count;
			bg.targetTabID = targetTabID;
			bg.debug = debug;
			bg.currentSpeed = currentSpeed;
		});

		totalTime(count, imageCount);

		chrome.tabs.executeScript({file: "sendRemainingTime.js", allFrames: false}, function() {
			chrome.tabs.sendMessage(targetTabID, {message:"sendRemainingTime"});
		});
	}
})

/**
 * Main method that includes Readability and executes scripts for computing total read time.
 *
 */
window.addEventListener("DOMContentLoaded", function() {
	// Add a link to the options page.
	document.getElementById("optionslink").href = chrome.extension.getURL("options.html");

	chrome.storage.sync.get("readTimeDefaultSpeed", function(result) {
		if (result && result.readTimeDefaultSpeed) {
		  currentSpeed = result.readTimeDefaultSpeed;
		  if (debug) {
		    // alert(currentSpeed + " read from options.");
		  }
		}
	});

	chrome.tabs.query({active: true, currentWindow:true}, function(activeTabs) {
		targetTabID = activeTabs[0].id;
		chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
			chrome.tabs.executeScript(null, { file: "sendArticleLength.js", allFrames: false});
		});
	});
});