chrome.extension.onRequest.addListener(function(wordLength) {
	var averageReadSpeedWPM = 200;
	var readTime = Math.ceil(wordLength/averageReadSpeedWPM);
	document.getElementById('status').innerHTML = readTime + " minute read.";
});
window.onload = function() {
	chrome.windows.getCurrent(function (currentWindow) {
		chrome.tabs.query({ active: true, windowId: currentWindow.id}, function(activeTabs){
			chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
				chrome.tabs.executeScript(
					activeTabs[0].id, {file: 'sendArticleLength.js', allFrames: true});
			});
		});
	});
}