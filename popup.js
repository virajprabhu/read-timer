chrome.extension.onRequest.addListener(function(request) {
	if(request.type=='count'){
		var wordLength = request.wordLength
		var averageReadSpeedWPM = 200;
		var readTime = wordLength / averageReadSpeedWPM;
		document.getElementById('status').innerHTML= Math.ceil(readTime) + " min read. ";
	}else if(request.type=='scroll'){
			document.getElementById('remaining').innerHTML=request.remainingTime + " left";
	}
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