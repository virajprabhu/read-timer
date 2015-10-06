chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({
		code: "$('#status').html(computeReadingTime());"
	});
});