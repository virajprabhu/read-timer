chrome.extension.onRequest.addListener(function(wordLength) {
	var averageReadSpeedWPM = 200;
	var readTime = wordLength / averageReadSpeedWPM;
	alert('Read Time' + readTime);
});
window.onload = function() {
	chrome.windows.getCurrent(function (currentWindow) {
		chrome.tabs.query({ active: true, windowId: currentWindow.id}, function(activeTabs){
			chrome.tabs.executeScript(
				activeTabs[0].id, {file: 'sendArticleLength.js', allFrames: true});
		});
	});
}