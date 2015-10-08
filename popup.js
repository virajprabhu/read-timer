chrome.extension.onRequest.addListener(function(wordLength) {
	var averageReadSpeedWPM = 200;
<<<<<<< HEAD
	var readTime = Math.ceil(wordLength/averageReadSpeedWPM);
	document.getElementById('status').innerHTML = readTime + " minute read.";
=======
	var readTime = wordLength / averageReadSpeedWPM;
	document.getElementById('status').innerHTML='Read Time: ' + Math.ceil(readTime) + " minutes";
>>>>>>> 0db128d9e29709dd0809b1e12da88160af6671aa
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