var count = -1;
function totalTime(wc){
	var count = wc;
	var wordLength = wc;	
	var averageReadSpeedWPM = 200;
	var readTime = wordLength / averageReadSpeedWPM;
	document.getElementById('status').innerHTML= Math.ceil(readTime) + "m read";	
}
chrome.extension.onRequest.addListener(function(request) {
	if(request.remainingTime!=undefined){
		document.getElementById('remaining').innerHTML=request.remainingTime + " left";
	}
});

window.onload = function() {
	chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
		chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: true}, function(result) {
			count = result;
			totalTime(count);					
			// chrome.tabs.executeScript({file: 'test.js', allFrames: true});		
		});
	});
}